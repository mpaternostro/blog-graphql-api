const router = require("express").Router();

const { signup, login } = require("../controllers/auth");
const signupValidation = require("../validators/signup");

router.put("/signup", signupValidation, signup);

router.post("/login", login);

module.exports = router;
