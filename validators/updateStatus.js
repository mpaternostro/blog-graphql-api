const { body } = require("express-validator");

module.exports = [body("status").notEmpty().withMessage("Please enter new status.")];
