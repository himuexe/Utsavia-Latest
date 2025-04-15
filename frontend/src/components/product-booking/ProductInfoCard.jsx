import React from "react";

const ProductInfoCard = ({ name, description }) => (
  <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-6 shadow-lg">
    <h2 className="text-xl font-secondary mb-2 text-primary">
      {name || "Product Name Unavailable"}
    </h2>
    <p className="text-[#2D3436]/80 font-primary">
      {description || "No description available"}
    </p>
  </div>
);

export default ProductInfoCard;