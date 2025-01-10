const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const createCurrentUser  = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
  
    try {
      const existingUser  = await User.findOne({
        'authMethods': {
          $elemMatch: {
            provider: 'local',
            email: req.body.email
          }
        }
      });
  
      if (existingUser ) {
        return res.status(400).json({ message: "User  already exists with this email" });
      }
  
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        primaryEmail: req.body.email,
        authMethods: [{
          provider: 'local',
          email: req.body.email,
          password: req.body.password
        }]
      });
  
      await user.save();
  
      const token = jwt.sign(
        { 
          userId: user.id,
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
  
      return res.status(200).send({ message: "User  registered successfully" });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
  
  module.exports = {
    createCurrentUser 
  };