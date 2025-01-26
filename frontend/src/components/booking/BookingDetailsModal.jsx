import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  const { _id, status, totalAmount, createdAt, items, address } = booking;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ y: -20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-[#2D3436] mb-6">Booking Details</h2>
          <div className="space-y-4 text-[#666]">
            <p>
              <span className="font-medium">Booking ID:</span> {_id}
            </p>
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
            <div>
              <h3 className="font-medium">Items:</h3>
              <ul className="list-disc list-inside">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {new Date(item.date).toLocaleDateString()} ({item.timeSlot})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-[#F0F0F0] text-[#2D3436] px-4 py-2 rounded-lg hover:bg-[#F0F0F0]/90 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={() => onUpdateStatus('cancelled')}
              className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition-colors duration-200"
            >
              Cancel Booking
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingDetailsModal;