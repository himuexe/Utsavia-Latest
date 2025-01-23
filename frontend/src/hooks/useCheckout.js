import { useState, useEffect } from 'react';
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
    isProcessing: false
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateCheckout = () => {
      const savedCheckoutType = localStorage.getItem('checkoutType');
      const savedBookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

      if (savedCheckoutType === 'cart' && cartItems.length === 0) {
        // handleCheckoutError('No items in cart');
      } else if (savedCheckoutType === 'direct' && !savedBookingDetails) {
        handleCheckoutError('No booking details found');
      }
    };

    validateCheckout();
  }, [cartItems, navigate, dispatch]);

  const handleCheckoutError = (message) => {
    dispatch(showToast({ message, type: 'ERROR' }));
    navigate('/');
  };

  const handleProceedToPayment = async (total) => {
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

      const { clientSecret } = await paymentApi.createPaymentIntent({
        amount: total,
        currency: 'inr',
        metadata: { checkoutType, items: JSON.stringify(items) }
      });

      setPaymentState({
        clientSecret,
        showPayment: true,
        isProcessing: false
      });
    } catch (error) {
      dispatch(showToast({
        message: error.response?.data?.message || 'Payment initialization failed',
        type: 'ERROR'
      }));
      setPaymentState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const items = checkoutType === 'cart' ? cartItems : [bookingDetails];
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

      // Create booking after payment success
      const bookingData = {
        items,
        totalAmount,
        paymentIntentId,
      };

      const booking = await bookingApi.createBooking(bookingData);
      console.log("Booking created:", booking);

      if (checkoutType === 'cart') {
        // Clear cart from local storage and Redux state
        dispatch(clearCart());

        // Clear cart from the server
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