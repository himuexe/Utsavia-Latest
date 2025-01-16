const Cart = require('../models/Cart');

 const getCartItems = async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { itemId, itemName, price, date, timeSlot, pincode, imageUrl, city } = req.body;

        // Validate required fields
        if (!itemId || !itemName || !price || !date || !timeSlot || !pincode || !city) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate booking time
        const bookingTime = new Date(date);
        const isValidTime = validateBookingTime(bookingTime, timeSlot);
        if (!isValidTime) {
            return res.status(400).json({ message: 'Invalid booking time or date' });
        }

        // Check if item already exists in cart
        const existingCartItem = await Cart.findOne({
            userId: req.userId,
            itemId,
            date,
            timeSlot
        });

        // if (existingCartItem) {
        //     return res.status(400).json({ 
        //         message: 'Item already exists in cart for this time slot' 
        //     });
        // }

        // Create new cart item
        const cartItem = new Cart({
            userId: req.userId,
            itemId,
            itemName,
            price,
            date,
            timeSlot,
            pincode,
            imageUrl,
            city
        });

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        const cartItem = await Cart.findOne({
            _id: cartItemId,
            userId: req.userId
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.deleteOne();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};

 const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.userId });
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
const validateBookingTime = (bookingDate, timeSlot) => {
    const now = new Date();
    
    // Convert booking date to start of day
    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);

    // Convert current date to start of day
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Check if booking date is in the past
    if (bookingDay < today) {
        return false;
    }

    // If booking is for today, check if time slot hasn't passed
    if (bookingDay.getTime() === today.getTime()) {
        const [hours, minutes, period] = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);
        const bookingTime = new Date(bookingDate);
        
        bookingTime.setHours(
            period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours),
            parseInt(minutes),
            0,
            0
        );

        // Add a buffer time (e.g., 1 hour before booking time)
        const bufferTime = new Date(bookingTime);
        bufferTime.setHours(bufferTime.getHours() - 1);

        if (bufferTime < now) {
            return false;
        }
    }

    return true;
};
module.exports = { getCartItems, addToCart, removeFromCart, clearCart };