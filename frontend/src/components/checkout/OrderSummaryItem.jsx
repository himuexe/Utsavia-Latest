import React from 'react';

export const OrderSummaryItem = ({ label, value, type = 'default' }) => (
  <div className="flex justify-between p-4 border-b border-zinc-800">
    <span className="text-zinc-400">{label}</span>
    <span className={`${type === 'total' ? 'text-purple-400 text-lg font-bold' : 'text-white'}`}>
      {value}
    </span>
  </div>
);
export default OrderSummaryItem;