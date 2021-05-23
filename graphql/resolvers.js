const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Post = require("../models/Post");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnauthorizedError = require("../errors/unauthorized");
const validateCreateUser = require("../validators/createUser");
const validateCreatePost = require("../validators/createPost");
const { getIO } = require("../socket");
const { POSTS_PER_PAGE } = require("../constants");

module.exports = {
  createUser: async function createUser({ input }) {
    const { email, password, name } = input;
    const errors = await validateCreateUser(input);
    if (errors && errors.length > 0) {
      return new UnprocessableEntityError("Signup failed.", [errors]);
    }
    const saltRounds = 12;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      return new ServerError(error.message);
    }
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    let savedUser;
    try {
      savedUser = await user.save();
    } catch (error) {
      return new ServerError(error.message);
    }
    return { ...savedUser._doc, _id: savedUser._id.toString() };
  },
  login: async function login({ input }) {
    const { email, password } = input;
    let user;
    try {
      user = await User.findOne({ email }).exec();
    } catch (error) {
      return new ServerError(error.message);
    }
    if (!user) {
      return new ResourceNotFoundError("User not found.");
    }
    const hashedPassword = user.password;
    let isEqualPassword;
    try {
      isEqualPassword = await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      return new ServerError(error.message);
    }
    if (isEqualPassword) {
      const userId = user._id.toString();
      const token = jwt.sign(
        {
          email,
          userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { token, userId };
    }
    return new UnauthorizedError("Password did not match.");
  },
  createPost: async function createPost({ input }, req) {
    if (!req.isAuth) {
      return new UnauthorizedError("Not authenticated.");
    }
    const { title, content, imageUrl } = input;
    const errors = await validateCreatePost(input);
    if (errors && errors.length > 0) {
      return new UnprocessableEntityError("Validation failed, entered data is incorrect.", [
        errors,
      ]);
    }
    let user;
    try {
      user = await User.findById(req.userId).exec();
    } catch (error) {
      return new ServerError(error.message);
    }
    if (!user) {
      return new ResourceNotFoundError("User not found.");
    }
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      creator: user,
    });
    try {
      await post.save();
    } catch (error) {
      return new ServerError(error.message);
    }
    user.posts.push(post);
    try {
      await user.save();
    } catch (error) {
      return new ServerError(error.message);
    }
    const socket = getIO();
    socket.emit("posts", {
      action: "create",
      post: {
        ...post._doc,
        creator: { _id: req.userId, name: user.name },
      },
    });
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  posts: async function posts({ page = 1 }, req) {
    if (!req.isAuth) {
      return new UnauthorizedError("Not authenticated.");
    }
    let totalItems;
    try {
      totalItems = await Post.countDocuments().exec();
    } catch (error) {
      return new ServerError(error.message);
    }
    try {
      const rawPosts = await Post.find()
        .skip(POSTS_PER_PAGE * (page - 1))
        .limit(POSTS_PER_PAGE)
        .sort({ createdAt: -1 })
        .populate("creator")
        .exec();
      const mappedPosts = rawPosts.map((post) => ({
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }));
      return {
        posts: mappedPosts,
        totalItems,
      };
    } catch (error) {
      return new ServerError(error.message);
    }
  },
  post: async function post({ id }, req) {
    if (!req.isAuth) {
      return new UnauthorizedError("Not authenticated.");
    }
    try {
      const rawPost = await Post.findById(id).populate("creator").exec();
      if (!rawPost) {
        return new ResourceNotFoundError("Post not found.");
      }
      const mappedPost = {
        ...rawPost._doc,
        _id: rawPost._id.toString(),
        createdAt: rawPost.createdAt.toISOString(),
        updatedAt: rawPost.updatedAt.toISOString(),
      };
      return mappedPost;
    } catch (error) {
      return new ServerError(error.message);
    }
  },
};
