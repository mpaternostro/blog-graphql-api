const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ServerError = require("../errors/server-error");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new UnprocessableEntityError("Validation failed, entered data is incorrect.", errors.array())
    );
  }
  const { email, password, name } = req.body;
  const saltRounds = 12;

  return bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return next(new ServerError(err.message));
    }
    const user = new User({
      email,
      password: hash,
      name,
    });
    try {
      await user.save();
    } catch (error) {
      return next(new ServerError(error.message));
    }
    return res.status(201).json({
      message: "User created succesfully.",
    });
  });
};
