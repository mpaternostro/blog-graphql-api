const { body, param } = require("express-validator");

const TITLE_MIN_LENGTH = 5;
const CONTENT_MIN_LENGTH = 5;

module.exports = [
  param("postId").notEmpty(),
  body("title")
    .notEmpty()
    .withMessage("Please enter a title.")
    .bail()
    .trim()
    .isLength({ min: TITLE_MIN_LENGTH })
    .withMessage(`Title must have more than ${TITLE_MIN_LENGTH} characters.`),
  body("content")
    .notEmpty()
    .withMessage("Please enter a content.")
    .bail()
    .trim()
    .isLength({ min: CONTENT_MIN_LENGTH })
    .withMessage(`Content must have more than ${CONTENT_MIN_LENGTH} characters.`),
];
