import React from 'react';
import { ShoppingBag } from 'lucide-react';

const CartSummary = ({ items }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-md font-primary">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag size={20} className="text-secondary" />
        <h2 className="text-xl font-secondary text-secondary">Order Summary</h2>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Items ({itemCount})</span>
          <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Convenience Fee</span>
          <span className="text-[#FF6B6B] font-medium">Free</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg text-primary">
          <span>Total Amount</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Inclusive of all taxes</p>
      </div>
    </div>
  );
};

export default CartSummary;