import React from "react";

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden
        border border-[#F0F0F0]
        ${hover ? 'hover:border-hover1 hover:-translate-y-1' : 'shadow-md'}
        transform transition-all duration-300
        ${className} min-h-[28rem]
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`bg-[#F9F9F9] p-4 border-b border-[#F0F0F0] ${className}`}>
      <h2 className="text-lg font-semibold text-[#2D3436]">{children}</h2>
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`px-6 pb-6 pt-4 border-t border-[#F0F0F0] ${className}`}>
      <div className="flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };