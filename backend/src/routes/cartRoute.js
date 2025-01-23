const express = require('express');
const verifyToken = require('../middleware/verifytoken');
const cartController = require('../controllers/CartController');

const router = express.Router();

// All routes are protected and require authentication
router.use(verifyToken);

router.get('/', cartController.getCartItems);
router.post('/add', cartController.addToCart);
router.delete('/clear', cartController.clearCart);
router.delete('/:cartItemId', cartController.removeFromCart);


module.exports = router;