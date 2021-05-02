const router = require("express").Router();

const { getPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/feed");
const isAuth = require("../middlewares/is-auth");
const createPostValidation = require("../validators/createPost");
const updatePostValidation = require("../validators/updatePost");

router.get("/posts", isAuth, getPosts);

router.get("/post/:postId", isAuth, getPost);

router.post("/post", isAuth, createPostValidation, createPost);

router.put("/post/:postId", isAuth, updatePostValidation, updatePost);

router.delete("/post/:postId", isAuth, deletePost);

module.exports = router;
