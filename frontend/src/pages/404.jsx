import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeft, Search } from "lucide-react";
import CompanyLogo from "../components/ui/CompanyLogo";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-color-background">
      {/* Header */}
      <header className="py-6 px-6 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <CompanyLogo onClick={() => window.location.href = "/"} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          {/* 404 Number */}
          <h1 className="text-8xl font-bold text-color-secondary font-secondary mb-4">
            4<span className="text-color-icon">0</span>4
          </h1>
          
          {/* Decorative Element */}
          <div className="flex justify-center mb-8">
            <div className="h-1 w-24 bg-color-marigold rounded-full"></div>
          </div>
          
          {/* Message */}
          <h2 className="text-3xl font-bold text-color-primary font-secondary mb-4">
            Page Not Found
          </h2>
          
          <p className="text-color-primary/80 mb-8 font-primary">
            Oops! It seems the event you're looking for has vanished like confetti after the party. Let's help you find your way back.
          </p>
          
          {/* Search Box */}
          <div className="relative mb-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for events..."
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-color-secondary font-primary"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-color-icon" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-color-secondary text-white rounded-full hover:bg-color-primary transition-colors duration-300 font-happiness"
            >
              <HomeIcon className="w-5 h-5" />
              Return Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-color-secondary text-color-secondary rounded-full hover:bg-color-secondary hover:text-white transition-colors duration-300 font-happiness"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer - Simplified version */}
      <footer className="py-6 px-6 border-t border-gray-200 text-center text-color-primary/80">
        <p className="font-secondary">
          © {new Date().getFullYear()} Utsavia Technologies Pvt. Ltd.
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;