const router = require("express").Router();

const { getPosts, createPost } = require("../controllers/feed");
const createPostValidation = require("../validators/createPost");

router.get("/posts", getPosts);

router.post("/post", createPostValidation, createPost);

module.exports = router;
