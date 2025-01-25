const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytoken");
const PaymentController = require("../controllers/PaymentController");

router.post('/create-payment-intent', verifyToken, PaymentController.createPayment);
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), PaymentController.webHook);
router.post('/webhook/razorpay', express.json(), PaymentController.webHook);

module.exports = router;