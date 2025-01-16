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
module.exports = { validateBookingTime };