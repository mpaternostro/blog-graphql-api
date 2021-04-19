const router = require("express").Router();

const { getPosts, getPost, createPost } = require("../controllers/feed");
const createPostValidation = require("../validators/createPost");

router.get("/posts", getPosts);

router.get("/post/:postId", getPost);

router.post("/post", createPostValidation, createPost);

module.exports = router;
