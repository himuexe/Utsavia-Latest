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
      <div className="space-y-3 text-primary font-primary">
        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {totalAmount.toLocaleString()}
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
                {item.itemName} - {new Date(item.date).toLocaleDateString()} ({item.timeSlot})
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={onViewDetails}
            className=" text-primary bg-background hover:bg-white hover:text-hover1 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium group disabled:opacity-50 disabled:cursor-not-allowed 
          hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;