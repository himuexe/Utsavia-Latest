import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/appSlice';

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        dispatch(showToast({ 
          message: confirmError.message, 
          type: 'ERROR' 
        }));
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      dispatch(showToast({ 
        message: 'Payment failed. Please try again.', 
        type: 'ERROR' 
      }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm bg-red-100/10 p-3 rounded-lg">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold
          hover:bg-purple-700 transition-colors duration-200 
          disabled:bg-purple-800 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
      </button>
    </form>
  );
};

export default PaymentForm;