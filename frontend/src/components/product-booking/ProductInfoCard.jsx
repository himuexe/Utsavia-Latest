import React from 'react';

const ProductInfoCard = ({ name, description }) => (
  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
    <h2 className="text-xl font-bold mb-2 text-white">
      {name || "Product Name Unavailable"}
    </h2>
    <p className="text-zinc-400">
      {description || "No description available"}
    </p>
  </div>
);

export default ProductInfoCard;