import React from 'react';

const CartSummary = ({ items }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Items ({items.length})</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Convenience Fee</span>
          <span className="text-green-600">Free</span>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold">
          <span>Total Amount</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;