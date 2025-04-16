import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9F9F9]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner Animation */}
        <div className="w-12 h-12 border-4 border-primary border-t-4 border-t-secondary rounded-full animate-spin"></div>
        {/* Loading Text */}
        <div className="text-[#2D3436] text-xl font-happiness">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;