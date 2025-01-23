import React from 'react';

const CartSummary = ({ items }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white rounded-lg border border-[#F0F0F0] p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#2D3436]">Order Summary</h2>
      <div className="space-y-2 mb-4 text-[#666]">
        <div className="flex justify-between">
          <span>Items ({items.length})</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fee</span>
          <span className="text-[#FF6B6B]">Free</span>
        </div>
      </div>
      <div className="border-t border-[#F0F0F0] pt-4">
        <div className="flex justify-between font-bold text-[#2D3436]">
          <span>Total Amount</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;