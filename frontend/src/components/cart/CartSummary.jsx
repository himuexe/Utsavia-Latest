import React from 'react';

const CartSummary = ({ items }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
      <div className="space-y-2 mb-4 text-zinc-400">
        <div className="flex justify-between">
          <span>Items ({items.length})</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fee</span>
          <span className="text-purple-400">Free</span>
        </div>
      </div>
      <div className="border-t border-zinc-800 pt-4">
        <div className="flex justify-between font-bold text-white">
          <span>Total Amount</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;