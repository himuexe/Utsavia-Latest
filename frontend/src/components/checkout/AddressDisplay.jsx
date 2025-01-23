import React from 'react';

const AddressDisplay = ({ userProfile, onEdit }) => {
  if (!userProfile) return null;

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 space-y-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2D3436]">Delivery Address</h2>
        <button
          onClick={onEdit}
          className="text-[#FF6B6B] hover:text-[#FF6B6B]/90 text-sm"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-[#666]">Phone: {userProfile?.phone || 'Not provided'}</p>
        <p className="text-[#666]">Address: {userProfile?.address || 'Not provided'}</p>
      </div>
    </div>
  );
};

export default AddressDisplay;