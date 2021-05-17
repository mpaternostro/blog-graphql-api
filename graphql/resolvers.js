const bcrypt = require("bcrypt");

const User = require("../models/User");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ServerError = require("../errors/server-error");
const validateCreateUser = require("../validators/createUser");

module.exports = {
  createUser: async function createUser({ input }) {
    const { email, password, name } = input;
    const errors = await validateCreateUser(input);
    if (errors) {
      return new UnprocessableEntityError("Signup failed.", [errors]);
    }
    const saltRounds = 12;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      return new ServerError(error.message);
    }
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    let savedUser;
    try {
      savedUser = await user.save();
    } catch (error) {
      return new ServerError(error.message);
    }
    return { ...savedUser._doc, _id: savedUser._id.toString() };
  },
};
