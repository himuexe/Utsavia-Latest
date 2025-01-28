 const validateCateringBooking = (req, res, next) => {
    const { eventDetails, menuItems } = req.body;
    
    if (!eventDetails?.date || !eventDetails?.guestCount || !eventDetails?.eventType) {
      return res.status(400).json({ message: 'Please provide all event details' });
    }
    
    if (!menuItems || menuItems.length === 0) {
      return res.status(400).json({ message: 'Please select at least one menu item' });
    }
    
    next();
  };
  
  module.exports = validateCateringBooking;