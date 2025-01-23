import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingCard = ({ booking, onViewDetails, onUpdateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl border border-zinc-800/50 p-6 shadow-xl"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Booking ID: {booking._id}
      </h2>
      <div className="space-y-2 text-white">
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`${
              booking.status === 'paid'
                ? 'text-green-400'
                : booking.status === 'pending'
                ? 'text-yellow-400'
                : 'text-red-400'
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
                {item.name} - {new Date(item.date).toLocaleDateString()}  ({item.timeSlot})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onViewDetails}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            View Details
          </button>
          <button
            onClick={() => onUpdateStatus('cancelled')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;