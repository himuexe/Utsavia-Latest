import React from "react";

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`
        bg-zinc-900 rounded-lg overflow-hidden
        border border-zinc-800
        ${hover ? 'hover:border-purple-600 hover:-translate-y-1' : 'shadow-md'}
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
    <div className={`bg-zinc-800 p-4 border-b border-zinc-700 ${className}`}>
      <h2 className="text-lg font-semibold text-white">{children}</h2>
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
    <div className={`px-6 pb-6 pt-4 border-t border-zinc-800 ${className}`}>
      <div className="flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };