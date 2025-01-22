const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifytoken");
const BookingController = require("../controllers/BookingController");

router.get("/pincode/:pincode",BookingController.validatePincode);

router.post('/create-payment-intent', verifyToken, BookingController.createPayment);

router.post('/webhook', express.raw({type: 'application/json'}), BookingController.webHook);
  


module.exports = router;