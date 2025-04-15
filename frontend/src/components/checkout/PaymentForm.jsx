import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/appSlice';

const PaymentForm = ({ amount, onSuccess, selectedAddress }) => {
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
      // Submit the payment form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        return;
      }

      // Confirm the payment with the address
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              address: {
                line1: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                postal_code: selectedAddress.zipCode,
                country: selectedAddress.country,
              },
            },
          },
        },
        redirect: 'if_required', // Prevents automatic redirection
      });

      if (confirmError) {
        setError(confirmError.message);
        dispatch(showToast({
          message: confirmError.message,
          type: 'ERROR',
        }));
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Call the onSuccess callback with the paymentIntent ID and selectedAddress
        onSuccess?.(paymentIntent.id, selectedAddress);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      dispatch(showToast({
        message: 'Payment failed. Please try again.',
        type: 'ERROR',
      }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <PaymentElement />
      {error && (
        <div className="text-[#FF6B6B] text-sm bg-[#FF6B6B]/10 p-3 rounded-lg">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-background text-primary font-primary p-3 rounded-xl 
          hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointerduration-200 
          disabled:bg-[#F0F0F0] disabled:text-[#666] disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
      </button>
    </form>
  );
};

export default PaymentForm;