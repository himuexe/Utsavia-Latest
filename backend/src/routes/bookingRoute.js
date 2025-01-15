const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

router.get("/pincode/:pincode",BookingController.validatePincode);

module.exports = router;