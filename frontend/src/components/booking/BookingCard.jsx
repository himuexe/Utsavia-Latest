import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingCard = ({ booking, onViewDetails, onUpdateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <h2 className="text-xl font-semibold text-[#2D3436] mb-4">
        Booking ID: {booking._id}
      </h2>
      <div className="space-y-2 text-[#666]">
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`${
              booking.status === 'paid'
                ? 'text-green-500'
                : booking.status === 'pending'
                ? 'text-[#FFD166]'
                : 'text-[#FF6B6B]'
            }`}
          >
            {booking.status}
          </span>
        </p>
        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {booking.totalAmount.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Date:</span>{' '}
          {format(new Date(booking.createdAt), 'dd MMM yyyy, hh:mm a')}
        </p>
        <div className="mt-4">
          <h3 className="font-medium">Items:</h3>
          <ul className="list-disc list-inside">
            {booking.items.map((item, index) => (
              <li key={index}>
                {item.name} - {new Date(item.date).toLocaleDateString()} ({item.timeSlot})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onViewDetails}
            className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition"
          >
            View Details
          </button>
          <button
            onClick={() => onUpdateStatus('cancelled')}
            className="bg-[#2D3436] text-white px-4 py-2 rounded-lg hover:bg-[#2D3436]/90 transition"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;