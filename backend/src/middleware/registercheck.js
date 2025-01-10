const { check } = require('express-validator');

const registercheck = [
  check("firstName")
    .optional()
    .isString()
    .trim()
    .withMessage("First Name must be a string"),
  
  check("lastName")
    .optional()
    .isString()
    .trim()
    .withMessage("Last Name must be a string"),

  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("authMethods")
    .optional()
    .isArray()
    .withMessage("Auth methods must be an array"),
  
  check("authMethods.*.provider")
    .optional()
    .isIn(['local', 'google'])
    .withMessage("Invalid auth provider"),
  
  check("authMethods.*.email")
    .optional()
    .isEmail()
    .withMessage("Valid email required for auth method"),
];

module.exports = registercheck;