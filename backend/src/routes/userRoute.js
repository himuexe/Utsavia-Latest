const express = require("express");
const registercheck = require("../middleware/registercheck");
const MyUserController = require("../controllers/MyUserController");

const router = express.Router();


router.post(
    "/register",
    registercheck,
    MyUserController.createCurrentUser
  );







module.exports = router;