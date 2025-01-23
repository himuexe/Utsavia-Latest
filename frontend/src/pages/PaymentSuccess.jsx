import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-[#F0F0F0] p-8 shadow-lg text-center max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#FF6B6B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-[#2D3436] mb-4">
          Payment Successful!
        </h1>
        <p className="text-[#666] mb-6">
          Thank you for your purchase. Your payment has been successfully processed.
        </p>

        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoHome}
          className="w-full bg-[#FF6B6B] text-white font-semibold py-3 rounded-lg hover:bg-[#FF6B6B]/90 transition-all duration-300 shadow-lg"
        >
          Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;