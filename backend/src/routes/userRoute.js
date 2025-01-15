const express = require("express");
const registercheck = require("../middleware/registercheck");
const MyUserController = require("../controllers/MyUserController");
const verifyToken = require("../middleware/verifytoken");

const router = express.Router();


router.post(
    "/register",
    registercheck,
    MyUserController.createCurrentUser
);
router.put(
    "/me",
    verifyToken,
    MyUserController.updateCurrentUser
  );

router.get("/me", verifyToken, MyUserController.getCurrentUser);

router.get("/check-profile", verifyToken, MyUserController.checkCurrentUser);


module.exports = router;