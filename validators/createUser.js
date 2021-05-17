const validator = require("validator");

const User = require("../models/User");

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 14;

async function emailAlreadyExists(value) {
  const email = await User.findOne({ email: value }).exec();
  if (email) {
    return true;
  }
  return false;
}

module.exports = async (input) => {
  const { email, password, name } = input;
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push("Invalid email.");
  }
  if (await emailAlreadyExists(email)) {
    errors.push("Email already in use.");
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
  ) {
    errors.push(
      `Password must have more than ${PASSWORD_MIN_LENGTH} characters and less than ${PASSWORD_MAX_LENGTH} characters.`
    );
  }
  if (validator.isEmpty(name)) {
    errors.push("Please enter your name.");
  }
  return errors;
};
