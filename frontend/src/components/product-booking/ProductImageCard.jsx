import React from 'react';

const ProductImageCard = ({ imageUrl }) => (
  <div className=" rounded-xl shadow-lg p-4 h-full">
    <img
      src={imageUrl || "/api/placeholder/600/400"}
      alt="Product"
      className="w-full h-full object-cover rounded-lg"
      onError={(e) => {
        e.target.src = "/api/placeholder/600/400";
      }}
    />
  </div>
);

export default ProductImageCard;