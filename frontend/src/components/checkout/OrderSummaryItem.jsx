import React from 'react';

export const OrderSummaryItem = ({ label, value, type = 'default' }) => (
  <div className="flex justify-between p-4 border-b border-[#F0F0F0]">
    <span className="text-[#666]">{label}</span>
    <span className={`${type === 'total' ? 'text-[#FF6B6B] text-lg font-bold' : 'text-[#2D3436]'}`}>
      {value}
    </span>
  </div>
);
export default OrderSummaryItem;