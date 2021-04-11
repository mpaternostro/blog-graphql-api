const router = require("express").Router();

const { getPosts } = require("../controllers/feed");

router.get("/posts", getPosts);

module.exports = router;
