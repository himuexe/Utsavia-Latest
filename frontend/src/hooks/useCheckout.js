import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import * as paymentApi from "../api/PaymentApi";
import { showToast } from '../store/appSlice';
import { clearCart, clearCartFromServer } from '../store/cartSlice';
import * as bookingApi from '../api/BookingApi';

const key = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(key);

export const useCheckout = (cartItems, checkoutType, bookingDetails) => {
  const [paymentState, setPaymentState] = useState({
    clientSecret: null,
    showPayment: false,
    isProcessing: false,
    paymentMethod: 'stripe', // Default to Stripe
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to dynamically load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      // Check if the script is already loaded
      if (window.Razorpay) {
        console.log("Razorpay script already loaded");
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true; // Load the script asynchronously
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.body.appendChild(script);
    });
  };

  const handleProceedToPayment = async (total, paymentMethod = 'stripe') => {
    setPaymentState(prev => ({ ...prev, isProcessing: true }));
    try {
      const items = checkoutType === 'cart' 
        ? cartItems.map(item => ({
            id: item._id,
            name: item.itemName,
            date: item.date,
            timeSlot: item.timeSlot,
          }))
        : [{
            id: bookingDetails._id,
            name: bookingDetails.itemName,
            date: bookingDetails.date,
            timeSlot: bookingDetails.timeSlot,
          }];

      const { clientSecret, orderId } = await paymentApi.createPaymentIntent({
        amount: total,
        currency: 'inr',
        metadata: { checkoutType, items: JSON.stringify(items) },
        paymentMethod,
      });

      setPaymentState({
        clientSecret,
        showPayment: true,
        isProcessing: false,
        paymentMethod,
      });

      if (paymentMethod === 'razorpay' && orderId) {
        // Load Razorpay script dynamically
        await loadRazorpayScript();

        const options = {
          key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
          amount: total * 100, // Amount in paise
          currency: 'INR',
          name: 'Your Company Name',
          description: 'Payment for Booking',
          order_id: orderId,
          handler: async (response) => {
            await handlePaymentSuccess(response.razorpay_payment_id);
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#F37254'
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      dispatch(showToast({
        message: error.response?.data?.message || 'Payment initialization failed',
        type: 'ERROR'
      }));
      setPaymentState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const items = checkoutType === 'cart' ? cartItems : [bookingDetails];
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

      const bookingData = {
        items,
        totalAmount,
        paymentIntentId: paymentId,
      };

      const booking = await bookingApi.createBooking(bookingData);
      console.log("Booking created:", booking);

      if (checkoutType === 'cart') {
        dispatch(clearCart());
        await dispatch(clearCartFromServer()).unwrap();
      }

      navigate('/payment-success');
    } catch (error) {
      dispatch(showToast({
        message: 'Payment recorded but booking creation or cart clearing failed',
        type: 'ERROR',
      }));
    }
  };

  return {
    paymentState,
    stripePromise,
    handleProceedToPayment,
    handlePaymentSuccess
  };
};