const jwt = require("jsonwebtoken");

const UnprocessableEntityError = require("../errors/unprocessable-entity-error");
const ServerError = require("../errors/server-error");
const UnauthorizedError = require("../errors/unauthorized");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(new UnprocessableEntityError("Token not provided"));
  }
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new UnauthorizedError(err.message));
    }
    if (decoded) {
      req.userId = decoded.userId;
      return next();
    }
    return next(new ServerError(err.message));
  });
};
