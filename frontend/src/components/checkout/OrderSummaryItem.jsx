import React from 'react';

export const OrderSummaryItem = ({ label, value, type = 'default' }) => (
  <div className="flex justify-between p-4 border-b border-[#F0F0F0] font-primary text-primary">
    <span className="">{label}</span>
    <span className={`${type === 'total' ? 'text-icon text-lg font-semibold' : 'text-icon'}`}>
      {value}
    </span>
  </div>
);
export default OrderSummaryItem;