import React from 'react';
import { motion } from 'framer-motion';

const BookingCard = ({ booking, onViewDetails}) => {
  const { _id, status, totalAmount, items, address } = booking;
  
  // Determine status display
  const getStatusBadge = () => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      {/* Card Header */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-[#F0F0F0] flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-sm font-medium text-gray-600">Booking #{_id.substring(0, 8)}</h3>
        </div>
        {getStatusBadge()}
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        {/* Summary */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#2D3436] mb-1">
              {items && items.length > 0 ? items[0].itemName : 'Booking'}
            </h2>
            <p className="text-sm text-gray-500">
              {items && items.length > 0 ? formatDate(items[0].date) : ''}
              {items && items.length > 0 && items[0].timeSlot ? ` • ${items[0].timeSlot}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Amount</p>
          </div>
        </div>
        
        {/* Address */}
        {address && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div className="text-gray-600">
                <p>{address.street}, {address.city}</p>
                <p>{address.state}, {address.zipCode}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Items */}
        {items && items.length > 1 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">BOOKING ITEMS</p>
            <ul className="space-y-2">
              {items.slice(0, 2).map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-center">
                  <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                  {item.itemName} • {formatDate(item.date)}
                </li>
              ))}
              {items.length > 2 && (
                <li className="text-xs text-primary font-medium">
                  +{items.length - 2} more items
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      {/* Card Actions */}
      <div className="p-4 border-t border-[#F0F0F0]">
        <button
          onClick={onViewDetails}
          className="text-primary bg-background hover:bg-white hover:text-hover1 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium group 
          hover:shadow-lg hover:shadow-[#9333EA]/20 flex items-center justify-center space-x-2 cursor-pointer border-1 border-hover1"
        >
          <span>View Details</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default BookingCard;