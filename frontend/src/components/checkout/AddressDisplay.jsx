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
        <h2 className="text-xl font-secondary  text-primary">Delivery Addresses</h2>
        <button
          onClick={onEdit}
          className="text-icon hover:text-icon/90 text-sm cursor-pointer"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2 text-primary font-primary">
        <p className="">Phone: {userProfile?.phone || 'Not provided'}</p>
        {userProfile?.addresses?.map((address, index) => (
          <div key={index} className="border border-[#F0F0F0] p-4 rounded-lg hover:shadow-lg hover:shadow-[#9333EA]/20 transition-all hover:border-hover1">
            <label className="flex items-center space-x-2 cursor-pointer ">
              <input
                type="radio"
                name="selectedAddress"
                value={index}
                checked={selectedAddress === index}
                onChange={() => handleAddressChange(index)}
                className="form-radio h-4 w-4 text-icon "
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