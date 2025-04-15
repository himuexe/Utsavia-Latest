import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from 'lucide-react'; // Assuming you're using lucide-react for icons

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center max-w-md w-full transition-all duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
            <CheckIcon className="w-10 h-10 text-secondary" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-primary mb-4 font-secondary">
          Payment Successful!
        </h1>
        <p className="text-primary/70 mb-6 font-primary">
          Thank you for your purchase. Your payment has been successfully processed.
        </p>

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="w-full bg-secondary/70 text-white font-semibold py-3 rounded-lg hover:bg-primary transition-all duration-300 shadow-lg font-happiness"
        >
          Go to Home
        </button>
        {/* Confirmation will be sent */}
        <p className="mt-6 text-sm text-primary/60 font-primary">
          <span className="inline-block w-4 h-4 bg-marigold/20 rounded-full mr-2 align-middle">
            <span className="flex items-center justify-center h-full">
              <span className="block w-2 h-2 bg-marigold rounded-full"></span>
            </span>
          </span>
          A confirmation email will be sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;