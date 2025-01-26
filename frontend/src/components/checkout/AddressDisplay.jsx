import React, { useState } from 'react';

const AddressDisplay = ({ userProfile, onEdit, onSelectAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  if (!userProfile) return null;

  const handleAddressChange = (index) => {
    setSelectedAddress(index);
    onSelectAddress(userProfile.addresses[index]); 
  };

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 space-y-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2D3436]">Delivery Addresses</h2>
        <button
          onClick={onEdit}
          className="text-[#FF6B6B] hover:text-[#FF6B6B]/90 text-sm"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-[#666]">Phone: {userProfile?.phone || 'Not provided'}</p>
        {userProfile?.addresses?.map((address, index) => (
          <div key={index} className="border border-[#F0F0F0] p-4 rounded-lg">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="selectedAddress"
                value={index}
                checked={selectedAddress === index}
                onChange={() => handleAddressChange(index)}
                className="form-radio h-4 w-4 text-[#FF6B6B] focus:ring-[#FF6B6B]"
              />
              <div>
                <p className="text-[#666]">Street: {address.street}</p>
                <p className="text-[#666]">City: {address.city}</p>
                <p className="text-[#666]">State: {address.state}</p>
                <p className="text-[#666]">Zip Code: {address.zipCode}</p>
                <p className="text-[#666]">Country: {address.country}</p>
                {address.isPrimary && (
                  <p className="text-[#FF6B6B] text-sm">Primary Address</p>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressDisplay;