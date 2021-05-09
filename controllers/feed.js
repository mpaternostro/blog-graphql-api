const { validationResult } = require("express-validator");

const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ForbiddenError = require("../errors/forbidden");

const Post = require("../models/Post");
const User = require("../models/User");
const clearImage = require("../utils/clearImage");

const { POSTS_PER_PAGE } = require("../constants");

exports.getPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems;
  try {
    totalItems = await Post.countDocuments();
  } catch (error) {
    return next(new ServerError(error.message));
  }
  try {
    const posts = await Post.find()
      .skip(POSTS_PER_PAGE * (page - 1))
      .limit(POSTS_PER_PAGE);
    return res.status(200).json({
      message: "Posts fetched succesfully.",
      posts,
      totalItems,
    });
  } catch (error) {
    return next(new ServerError(error.message));
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      next(new ResourceNotFoundError("Post not found."));
    }
    res.status(200).json({
      message: "Post fetched succesfully.",
      post,
    });
  } catch (error) {
    next(new ServerError(error.message));
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new UnprocessableEntityError("Validation failed, entered data is incorrect.", errors.array())
    );
  }
  const { title, content } = req.body;
  if (!req.file) {
    return next(new UnprocessableEntityError("Image not provided."));
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();
  } catch (error) {
    return next(new ServerError(error.message));
  }
  let user;
  try {
    user = await User.findById(req.userId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!user) {
    next(new ResourceNotFoundError("User not found."));
  }
  user.posts.push(post);
  try {
    await user.save();
  } catch (error) {
    return next(new ServerError(error.message));
  }
  return res.status(201).json({
    message: "Post created successfully!",
    post,
    creator: {
      _id: user._id,
      name: user.name,
    },
  });
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new UnprocessableEntityError("Validation failed, entered data is incorrect.", errors.array())
    );
  }
  const { postId } = req.params;
  const { title, content } = req.body;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!post) {
    return next(new ResourceNotFoundError("Post not found."));
  }
  if (post.creator.toString() !== req.userId) {
    return next(new ForbiddenError("Not authorized for this operation."));
  }
  post.title = title;
  post.content = content;
  if (req.file) {
    try {
      await clearImage(post.imageUrl);
    } catch (error) {
      return next(new ServerError(error.message));
    }
    post.imageUrl = req.file.path.replace("\\", "/");
  }
  if (!post.imageUrl) {
    return next(new UnprocessableEntityError("Image not provided.", errors.array()));
  }
  try {
    await post.save();
    return res.status(200).json({
      message: "Post updated successfully!",
      post,
    });
  } catch (error) {
    return next(new ServerError(error.message));
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!post) {
    return next(new ResourceNotFoundError("Post not found."));
  }
  if (post.creator.toString() !== req.userId) {
    return next(new ForbiddenError("Not authorized for this operation."));
  }
  let user;
  try {
    await clearImage(post.imageUrl);
    await post.delete();
    user = await User.findById(req.userId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!user) {
    return next(new ResourceNotFoundError("User not found."));
  }
  user.posts.pull(post._id);
  try {
    await user.save();
  } catch (error) {
    return next(new ServerError(error.message));
  }
  return res.status(200).json({
    message: "Post deleted successfully!",
  });
};
