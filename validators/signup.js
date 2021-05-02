const { body } = require("express-validator");

const User = require("../models/User");

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 14;

async function emailAlreadyExists(value) {
  const email = await User.findOne({ email: value });
  if (email) {
    return Promise.reject();
  }
  return Promise.resolve();
}

module.exports = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .bail()
    .custom(emailAlreadyExists)
    .withMessage("Email already in use.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Please enter a password.")
    .trim()
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`Password must have more than ${PASSWORD_MIN_LENGTH} characters.`)
    .isLength({ max: PASSWORD_MAX_LENGTH })
    .withMessage(`Password must have less than ${PASSWORD_MAX_LENGTH} characters.`),
  body("name").notEmpty().withMessage("Please enter your name."),
];
