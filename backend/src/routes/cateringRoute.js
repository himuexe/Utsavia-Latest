const express = require('express');
const router = express.Router();
const cateringController = require('../controllers/CateringController');
const verifytoken = require('../middleware/verifytoken');
const  validateCateringBooking  = require('../middleware/validateCatering');

// User routes
router.post('/', verifytoken, validateCateringBooking , cateringController.createBooking);
router.get('/my-bookings', verifytoken, cateringController.getUserBookings);
router.get('/:id', verifytoken, cateringController.getBookingById);
router.put('/:id', verifytoken, validateCateringBooking, cateringController.updateBookingStatus);



module.exports = router;