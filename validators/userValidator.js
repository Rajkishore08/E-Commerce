const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage('Password must be at least 6 characters long and contain both letters and numbers'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage('Password must be at least 6 characters long and contain both letters and numbers'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin
};
