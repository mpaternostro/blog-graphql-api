const { validationResult } = require("express-validator");

const Post = require("../models/Post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first post",
        content: "this is the first post",
        creator: {
          name: "Charly",
        },
        imageUrl: "images/1617465920087-sword-of-destiny.jpeg",
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({ message: "Validation failed, entered data is incorrect.", errors: errors.array() });
  } else {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl: "images/1617465920087-sword-of-destiny.jpeg",
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
      console.error(error);
    }
  }
};
