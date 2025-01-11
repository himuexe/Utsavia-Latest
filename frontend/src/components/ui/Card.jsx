import React from "react";

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        border border-gray-200
        ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : 'shadow-md'}
        transform transition-all duration-300
        ${className} min-h-[28rem]  // Set a minimum height
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`bg-gray-100 p-4 border-b border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
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
    <div className={`px-6 pb-6 pt-4 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };