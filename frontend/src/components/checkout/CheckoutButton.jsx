import React from 'react';

export const CheckoutButton = ({ 
  isLoggedIn, 
  isAddressValid, 
  isEditing, 
  isProcessing, 
  onClick 
}) => {
  const getButtonText = () => {
    if (!isLoggedIn) return 'Please Log In to Continue';
    if (!isAddressValid) return 'Please Add Delivery Address';
    if (isEditing) return 'Please Save Address to Continue';
    if (isProcessing) return 'Processing...';
    return 'Proceed to Payment';
  };

  return (
    <button
      className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-xl font-semibold
        hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:from-zinc-700 disabled:to-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed
        disabled:transform-none"
      onClick={onClick}
      disabled={!isLoggedIn || !isAddressValid || isEditing || isProcessing}
    >
      {getButtonText()}
    </button>
  );
};
export default CheckoutButton;