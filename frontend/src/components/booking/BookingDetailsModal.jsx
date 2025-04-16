import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/appSlice";

const BookingDetailsModal = ({ booking, onClose, onUpdateStatus }) => {
  const dispatch = useDispatch();
  const { _id, status, totalAmount, createdAt, items, address } = booking;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancelBooking = () => {
    onUpdateStatus("cancelled");
    onClose();
    dispatch(
      showToast({ message: "Booking cancelled successfully!", type: "INFO" })
    );
  };
  
  // Format date with time
  const formatDateTime = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  // Format date only
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Status badge color
  const getStatusColor = () => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'processing': 'bg-purple-100 text-purple-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-center mb-2">Confirm Cancellation</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-[#F0F0F0] text-[#2D3436] px-4 py-2 rounded-lg hover:bg-[#F0F0F0]/90 transition-colors duration-200 min-w-24"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition-colors duration-200 min-w-24"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Booking Details Modal */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-[#F0F0F0]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl text-primary font-happiness">
                  Booking Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">BOOKING SUMMARY</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Booking ID</span>
                        <span className="text-sm font-medium">{_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
                          {status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created On</span>
                        <span className="text-sm font-medium">{createdAt ? formatDateTime(createdAt) : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <span className="text-lg font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  {address && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">DELIVERY ADDRESS</h3>
                      <div className="space-y-1 text-gray-700">
                        <p>{address.street},</p>
                        <p>{address.city}, {address.state}</p>
                        <p>{address.zipCode}, {address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Column */}
                <div>
                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">BOOKING ITEMS</h3>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                          <h4 className="font-medium text-gray-800 mb-1">{item.itemName}</h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {formatDate(item.date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {item.timeSlot}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="bg-[#F0F0F0] text-[#2D3436] px-4 py-2 rounded-lg hover:bg-[#F0F0F0]/90 transition-colors duration-200 cursor-pointer"
              >
                Close
              </button>
              {status !== "cancelled" && status !== "completed" && (
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition-colors duration-200 cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default BookingDetailsModal;