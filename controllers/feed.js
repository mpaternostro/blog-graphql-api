const { validationResult } = require("express-validator");
const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");

const Post = require("../models/Post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Posts fetched succesfully.",
      posts,
    });
  } catch (error) {
    next(new ServerError(error.message));
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
    next(
      new UnprocessableEntityError("Validation failed, entered data is incorrect.", errors.array())
    );
  } else {
    const { title, content } = req.body;
    if (!req.file) {
      next(new UnprocessableEntityError("Image not provided."));
    } else {
      const imageUrl = req.file.path.replace("\\", "/");
      const post = new Post({
        title,
        content,
        imageUrl,
        creator: {
          name: "Charly",
        },
      });
      try {
        await post.save();
        res.status(201).json({
          message: "Post created successfully!",
          post,
        });
      } catch (error) {
        next(new ServerError(error.message));
      }
    }
  }
};
