const express = require("express");
const { check } = require("express-validator");
const passport = require('passport');
const verifyToken = require("../middleware/verifytoken");
const AuthController = require("../controllers/AuthController");


const router = express.Router();

router.post(
    "/login",
    [
      check("email", "Email is required").trim().isEmail(),
      check(
        "password",
        "Password with 6 or more characters is required"
      ).trim().isLength({ min: 6 }),
    ],
    AuthController.login
  );

router.get("/validate-token", verifyToken, (req, res) => {
    res.status(200).send({ userId: req.userId });
  });

router.post("/logout", AuthController.logout);


router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

router.get('/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login',
      session: false 
    },
    AuthController.handleCallback
),
    
);


module.exports = router;