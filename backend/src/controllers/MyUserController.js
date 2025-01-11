const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createCurrentUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {

    const existingUser = await User.findOne({
      'authMethods.email': req.body.email
    });

    if (existingUser) {
      const hasLocalAuth = existingUser.authMethods.some(
        method => method.provider === 'local'
      );

      if (hasLocalAuth) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      
      existingUser.authMethods.push({
        provider: 'local',
        email: req.body.email,
        password: hashedPassword
      });

      // Update user details if they weren't set before
      if (!existingUser.firstName) existingUser.firstName = req.body.firstName;
      if (!existingUser.lastName) existingUser.lastName = req.body.lastName;

      await existingUser.save();

      const token = jwt.sign(
        { 
          userId: existingUser.id,
          provider: 'local'
        }, 
        process.env.JWT_SECRET_KEY, 
        {
          expiresIn: "1d"
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.status(200).send({ message: "Local authentication added successfully" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      primaryEmail: req.body.email,
      authMethods: [{
        provider: 'local',
        email: req.body.email,
        password: hashedPassword
      }]
    });

    await newUser.save();

    const token = jwt.sign(
      { 
        userId: newUser.id,
        provider: 'local'
      }, 
      process.env.JWT_SECRET_KEY, 
      {
        expiresIn: "1d"
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(200).send({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
  module.exports = {
    createCurrentUser 
  };