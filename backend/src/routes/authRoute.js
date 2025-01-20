const express = require("express");
const { check, validationResult } = require("express-validator");
const passport = require('passport');
const verifyToken = require("../middleware/verifytoken");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Middleware for validation errors
const validateLogin = [
  check("email", "Email is required").trim().isEmail(),
  check("password", "Password with 6 or more characters is required").isLength({ min: 6 }),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Login route
router.post("/login", validateLogin, handleValidationErrors, AuthController.login);

// Validate token route
router.get("/validate-token", verifyToken, (req, res) => {
  res.status(200).send({ userId: req.userId });
});

// Logout route
router.post("/logout", AuthController.logout);

// Google authentication route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: process.env.FRONTEND_URL || '/' // Fallback to root if FRONTEND_URL is not set
  }),
  AuthController.handleCallback
);

module.exports = router;