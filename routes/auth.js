const router = require("express").Router();

const { signup } = require("../controllers/auth");
const signupValidation = require("../validators/signup");

router.put("/signup", signupValidation, signup);

module.exports = router;
