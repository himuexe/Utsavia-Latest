import React from 'react';
import { format } from 'date-fns';

const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-[#2D3436] mb-4">Booking Details</h2>
        <div className="space-y-4 text-[#666]">
          <p>
            <span className="font-medium">Booking ID:</span> {booking._id}
          </p>
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
            className="bg-[#F0F0F0] text-[#2D3436] px-4 py-2 rounded-lg hover:bg-[#F0F0F0]/90 transition"
          >
            Close
          </button>
          <button
            onClick={() => onUpdateStatus('cancelled')}
            className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;