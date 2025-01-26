import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingCard = ({ booking, onViewDetails, onUpdateStatus }) => {
  const { _id, status, totalAmount, createdAt, items, address } = booking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <h2 className="text-xl font-bold text-[#2D3436] mb-4">Booking ID: {_id}</h2>
      <div className="space-y-3 text-[#666]">
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === 'paid'
                ? 'bg-green-100 text-green-600'
                : status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {status}
          </span>
        </p>
        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {totalAmount.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Date:</span>{' '}
          {format(new Date(createdAt), 'dd MMM yyyy, hh:mm a')}
        </p>
        {address && (
          <div>
            <p className="font-medium">Address:</p>
            <p>{address.street}, {address.city}</p>
            <p>{address.state}, {address.zipCode}</p>
            <p>{address.country}</p>
          </div>
        )}
        <div className="mt-4">
          <h3 className="font-medium">Items:</h3>
          <ul className="list-disc list-inside">
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - {new Date(item.date).toLocaleDateString()} ({item.timeSlot})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={onViewDetails}
            className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition-colors duration-200"
          >
            View Details
          </button>
          <button
            onClick={() => onUpdateStatus('cancelled')}
            className="bg-[#2D3436] text-white px-4 py-2 rounded-lg hover:bg-[#2D3436]/90 transition-colors duration-200"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;