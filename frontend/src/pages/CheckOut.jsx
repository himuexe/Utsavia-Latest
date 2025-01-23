import React, { useState ,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Elements } from '@stripe/react-stripe-js';
import * as apiClient from '../api/MyUserApi';
import {
  selectCartItems,
  selectCheckoutType,
  selectBookingDetails,
} from '../store/cartSlice';
import { selectIsAddressValid ,selectIsLoggedIn, } from '../store/appSlice';
import { useCheckout } from '../hooks/useCheckout';
import  AddressForm  from '../components/checkout/AddressForm';
import  AddressDisplay  from '../components/checkout/AddressDisplay';
import  PaymentForm  from '../components/checkout/PaymentForm';
import  OrderSummaryItem  from '../components/checkout/OrderSummaryItem';
import  CheckoutButton  from '../components/checkout/CheckoutButton';
import  Loading from '../components/ui/Loading';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Selectors
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate(); 
  const isAddressValid = useSelector(selectIsAddressValid);
  const cartItems = useSelector(selectCartItems);
  const checkoutType = useSelector(selectCheckoutType);
  const bookingDetails = useSelector(selectBookingDetails);

  useEffect(() => {
    if (checkoutType === 'direct' && !bookingDetails) {
      // Redirect to home page or another appropriate page
      navigate('/');
    } else if (checkoutType === 'cart' && cartItems.length === 0) {
      // Redirect to the cart page if the cart is empty
      navigate('/cart');
    }
  }, [checkoutType, bookingDetails, cartItems, navigate]);

  // Custom hook for checkout logic
  const { 
    paymentState, 
    stripePromise, 
    handleProceedToPayment, 
    handlePaymentSuccess 
  } = useCheckout(cartItems, checkoutType, bookingDetails);

  // Profile data query
  const {
    data: userProfile,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useQuery('currentUser', apiClient.fetchCurrentUser, {
    enabled: isLoggedIn,
    retry: 2
  });

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-red-500">
          Error loading profile. Please try again.
        </div>
      </div>
    );
  }

  const total = checkoutType === 'cart'
    ? cartItems.reduce((sum, item) => sum + item.price, 0)
    : bookingDetails?.price || 0;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-black to-zinc-900 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Address Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Delivery Information
          </h1>

          {isAddressValid && !isEditing ? (
            <AddressDisplay
              userProfile={userProfile}
              onEdit={() => setIsEditing(true)}
            />
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl border border-zinc-800/50 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isEditing ? 'Edit Delivery Details' : 'Enter Delivery Details'}
              </h2>
              <AddressForm
                initialData={userProfile}
                onSuccess={() => {
                  refetchProfile();
                  setIsEditing(false);
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Order Summary Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl border border-zinc-800/50 p-6 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Order Summary
          </h2>

          <div className="space-y-4">
            {checkoutType === 'cart' && cartItems.map((item) => (
              <OrderSummaryItem
                key={item._id}
                label={
                  <div className="flex flex-col">
                    <span>{item.itemName}</span>
                    <span className="text-sm">
                      {new Date(item.date).toLocaleDateString()} - {item.timeSlot}
                    </span>
                  </div>
                }
                value={`₹${item.price.toLocaleString()}`}
              />
            ))}

            {checkoutType === 'direct' && bookingDetails && (
              <>
                <OrderSummaryItem
                  label="Item"
                  value={bookingDetails.itemName}
                />
                <OrderSummaryItem
                  label="Date"
                  value={bookingDetails.date}
                />
                <OrderSummaryItem
                  label="Time"
                  value={bookingDetails.timeSlot}
                />
              </>
            )}

            <OrderSummaryItem
              label="Total Amount"
              value={`₹${total.toLocaleString()}`}
              type="total"
            />

            {paymentState.showPayment && paymentState.clientSecret ? (
              <div className="mt-6">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentState.clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#9333ea',
                      },
                    },
                  }}
                >
                  <PaymentForm 
                    amount={total} 
                    onSuccess={handlePaymentSuccess} 
                  />
                </Elements>
              </div>
            ) : (
              <CheckoutButton
                isLoggedIn={isLoggedIn}
                isAddressValid={isAddressValid}
                isEditing={isEditing}
                isProcessing={paymentState.isProcessing}
                onClick={() => handleProceedToPayment(total)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;