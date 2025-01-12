const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      'authMethods.email': email
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const localAuth = user.authMethods.find(
      method => method.provider === "local" && method.email === email
    );
    if (!localAuth) {
      const googleAuth = user.authMethods.find(
        method => method.provider === "google" && method.email === email
      );

      if (googleAuth) {
        return res.status(400).json({ 
          message: "Please sign in with Google",
          useGoogle: true 
        });
      }

      return res.status(400).json({ message: "Invalid Credentials" });
    }


    const isMatch = await bcrypt.compare(password, localAuth.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        provider: "local",
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400000,
    });

    return res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const handleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }


    const token = jwt.sign(
      {
        userId: req.user._id, 
        provider: "google",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};
const logout = (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

  
module.exports = {
  login,
  handleCallback,
  logout
};
