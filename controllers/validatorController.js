const { body, validationResult } = require("express-validator");

const loginRules = () => {
  return [
    // username must be an email
    body("username", "Invalid username.").trim().isEmail().normalizeEmail(),
    // password must be at least 1 char long
    body("password", "Password cannot be empty").trim().notEmpty()
  ];
};

const createRules = () => {
  return [
    // Validate and sanitize client provided fields.
    body("firstName", "First name cannot be empty").trim().notEmpty().escape(),
    body("lastName", "Last name cannot be empty").trim().notEmpty().escape(),
    body("email", "Email must be valid").trim().isEmail().normalizeEmail(),
    body("password", "Password must be valid")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches("[a-z]")
      .withMessage("Password must Contain at least one lower case letter")
      .matches("[A-Z]")
      .withMessage("Password must Contain at least one Upper case letter")
  ];
};

const upgradeRules = () => {
  return [
    // role must be valid [member, admin]
    body("role", "Invalid role.").trim().isIn(['member','admin']),
    // password must be at least 1 char long
    body("password", "Password cannot be empty").trim().notEmpty(),
  ];
};

const commentRules = () => {
  return [
    body("commentTitle", "Invalid Title.")
      .trim()
      .isLength({ max: 64 })
      .withMessage("Title must be less than 64 characters"),
      // .escape(),

    // comment must valid
    body("commentContent", "Invalid Comment.")
      .trim()
      .isLength({ min: 10, max: 512 })
      .withMessage("Comment must be between 10 and 512 characters"),
      // .escape(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.locals.validation = errors;
  return next();
};

module.exports = {
  loginRules,
  createRules,
  upgradeRules,
  commentRules,
  validate,
};

//code snippet from: https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go