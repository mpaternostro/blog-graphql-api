const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnauthorizedError = require("../errors/unauthorized");

exports.signup = async (req, res, next) => {
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!user) {
    return next(new ResourceNotFoundError("User not found."));
  }
  const hashedPassword = user.password;
  return bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) {
      return next(new ServerError(err.message));
    }
    if (result) {
      const userId = user._id.toString();
      const token = jwt.sign(
        {
          email,
          userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token, userId });
    }
    return next(new UnauthorizedError("Password did not match."));
  });
};
