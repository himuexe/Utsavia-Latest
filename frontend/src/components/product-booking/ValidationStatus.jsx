import React from 'react';

const ValidationStatus = ({ selectedDate, selectedSlot, pincode }) => (
  <div className="text-sm">
    <div className={`flex items-center ${selectedDate ? "text-green-600" : "text-gray-400"}`}>
      <span className="mr-2">✓</span> Date selected
    </div>
    <div className={`flex items-center ${selectedSlot ? "text-green-600" : "text-gray-400"}`}>
      <span className="mr-2">✓</span> Time slot selected
    </div>
    <div className={`flex items-center ${pincode ? "text-green-600" : "text-gray-400"}`}>
      <span className="mr-2">✓</span> Pincode verified
    </div>
  </div>
);

export default ValidationStatus;