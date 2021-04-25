const router = require("express").Router();

const { getPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/feed");
const createPostValidation = require("../validators/createPost");
const updatePostValidation = require("../validators/updatePost");

router.get("/posts", getPosts);

router.get("/post/:postId", getPost);

router.post("/post", createPostValidation, createPost);

router.put("/post/:postId", updatePostValidation, updatePost);

router.delete("/post/:postId", deletePost);

module.exports = router;
