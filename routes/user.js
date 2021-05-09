const router = require("express").Router();

const { getStatus, updateStatus } = require("../controllers/user");

const isAuth = require("../middlewares/is-auth");
const updateStatusValidation = require("../validators/updateStatus");

router.get("/status", isAuth, getStatus);

router.patch("/status", isAuth, updateStatusValidation, updateStatus);

module.exports = router;
