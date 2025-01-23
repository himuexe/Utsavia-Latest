import React from 'react';

export const CheckoutButton = ({
  isLoggedIn,
  isAddressValid,
  isEditing,
  isProcessing,
  onClick,
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
      className="w-full bg-[#FF6B6B] text-white py-4 rounded-xl font-semibold
        hover:bg-[#FF6B6B]/90 transition-all duration-300 shadow-lg
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:bg-[#F0F0F0] disabled:text-[#666] disabled:cursor-not-allowed
        disabled:transform-none"
      onClick={onClick}
      disabled={!isLoggedIn || !isAddressValid || isEditing || isProcessing}
    >
      {getButtonText()}
    </button>
  );
};
export default CheckoutButton;