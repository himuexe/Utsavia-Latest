import React from 'react';
import { format } from 'date-fns';

const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl border border-zinc-800/50 p-6 shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Booking Details</h2>
        <div className="space-y-4 text-white">
          <p>
            <span className="font-medium">Booking ID:</span> {booking._id}
          </p>
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
          <div>
            <h3 className="font-medium">Items:</h3>
            <ul className="list-disc list-inside">
              {booking.items.map((item, index) => (
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
            className="bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
          >
            Close
          </button>
          <button
            onClick={() => onUpdateStatus('cancelled')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;