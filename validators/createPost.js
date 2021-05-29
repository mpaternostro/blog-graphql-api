const validator = require("validator");

const TITLE_MIN_LENGTH = 5;
const CONTENT_MIN_LENGTH = 5;

module.exports = async (input) => {
  const { title, content } = input;
  const errors = [];
  if (validator.isEmpty(title)) {
    errors.push("Please enter a title");
  } else if (!validator.isLength(title, { min: TITLE_MIN_LENGTH })) {
    errors.push(`Title must have more than ${TITLE_MIN_LENGTH} characters.`);
  }
  if (validator.isEmpty(content)) {
    errors.push("Please enter a content.");
  } else if (!validator.isLength(content, { min: CONTENT_MIN_LENGTH })) {
    errors.push(`Content must have more than ${CONTENT_MIN_LENGTH} characters.`);
  }
  return errors;
};
