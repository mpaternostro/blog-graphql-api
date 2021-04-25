const fs = require("fs");

module.exports = (filePath) => {
  if (filePath) {
    return fs.promises.unlink(filePath);
  }
  return console.error("File path not provided.");
};
