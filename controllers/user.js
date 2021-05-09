const { validationResult } = require("express-validator");

const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnprocessableEntityError = require("../errors/unprocessable-entity-error");

const User = require("../models/User");

exports.getStatus = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!user) {
    return next(new ResourceNotFoundError("User not found."));
  }
  return res.status(200).json({
    message: "User fetched succesfully.",
    status: user.status,
  });
};

exports.updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new UnprocessableEntityError("Validation failed, entered data is incorrect.", errors.array())
    );
  }
  const { status } = req.body;
  let user;
  try {
    user = await User.findById(req.userId);
  } catch (error) {
    return next(new ServerError(error.message));
  }
  if (!user) {
    return next(new ResourceNotFoundError("User not found."));
  }
  user.status = status;
  try {
    await user.save();
  } catch (error) {
    return next(new ServerError(error.message));
  }
  return res.status(200).json({
    message: "Status updated successfully!",
  });
};
