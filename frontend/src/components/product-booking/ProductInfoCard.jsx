import React from 'react';

const ProductInfoCard = ({ name, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold mb-2 font-secondary">
      {name || "Product Name Unavailable"}
    </h2>
    <p className="text-gray-600 font-happiness">
      {description || "No description available"}
    </p>
  </div>
);

export default ProductInfoCard;