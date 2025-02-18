const { body, validationResult } = require("express-validator");

//Signup validation rules
const signupValidationRules = [
  //Firstname Validation
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("Firstname is required")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Firstname must contain only letters")
    .isLength({ min: 3, max: 30 })
    .withMessage("Firstname must be 3 to 30 characters"),

  //Lastname Validation
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Lastname is required")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Lastname must contain only letters")
    .isLength({ min: 3, max: 30 })
    .withMessage("Lastname must be 3 to 30 characters"),

  //Username Validation
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must be Alphanumeric")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3 to 30 characters"),

  //Email Validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  // Password Validation
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 9 })
    .withMessage("Password must be at least 9 characters"),
];

//Signup Validation

const loginValidationRules = [
  //Email Validation
  body("email").trim().notEmpty().withMessage("Email is required"),
  // Password Validation
  body("password").trim().notEmpty().withMessage("Password is required"),
];

//Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: errors.array().map((err) => err.msg) });
  }
  next();
};
module.exports = {
  signupValidationRules,
  loginValidationRules,
  validate,
};
