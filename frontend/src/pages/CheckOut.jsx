import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import * as apiClient from "../api/MyUserApi";
import { 
  selectIsLoggedIn, 
  selectIsAddressValid, 
  showToast, 
  setAddressValidity 
} from "../store/appSlice";
import { 
  selectCartItems,
  selectCheckoutType,
  selectBookingDetails,
  setCheckoutDetails,
} from "../store/cartSlice";
import AddressForm from "../components/checkout/AddressForm";
import AddressDisplay from "../components/checkout/AddressDisplay";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  // Get cart items and checkout details from Redux
  const cartItems = useSelector(selectCartItems);
  const checkoutType = useSelector(selectCheckoutType);
  const bookingDetails = useSelector(selectBookingDetails);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAddressValid = useSelector(selectIsAddressValid);

  useEffect(() => {
    // Load checkout details from localStorage
    const savedCheckoutType = localStorage.getItem('checkoutType');
    const savedBookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

    if (savedCheckoutType === 'cart') {
      // For cart checkout, ensure cart items are available
      if (cartItems.length === 0) {
        dispatch(showToast({ 
          message: 'No items to checkout', 
          type: 'ERROR' 
        }));
        navigate('/');
      }
    } else if (savedCheckoutType === 'direct') {
      // For direct checkout, ensure booking details are available
      if (!savedBookingDetails) {
        dispatch(showToast({ 
          message: 'No items to checkout', 
          type: 'ERROR' 
        }));
        navigate('/');
      } else {
        // Set booking details in Redux store
        dispatch(setCheckoutDetails({
          type: 'direct',
          bookingDetails: savedBookingDetails,
        }));
      }
    } else {
      // No valid checkout data
      dispatch(showToast({ 
        message: 'No items to checkout', 
        type: 'ERROR' 
      }));
      navigate('/');
    }
  }, [cartItems, navigate, dispatch]);

  const isCartCheckout = checkoutType === 'cart';
  const isDirectCheckout = checkoutType === 'direct';

  const { data: userProfile, isLoading, error, refetch: refetchProfile } = useQuery(
    "currentUser",
    apiClient.fetchCurrentUser,
    {
      enabled: isLoggedIn,
      retry: 2,
      onSuccess: (data) => {
        const hasValidAddress = !!(data?.phone && data?.address);
        dispatch(setAddressValidity(hasValidAddress));
      },
      onError: (error) => {
        dispatch(showToast({ 
          message: error?.message || 'Failed to fetch user profile', 
          type: 'ERROR' 
        }));
        dispatch(setAddressValidity(false));
      },
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-center text-red-500">
          Error loading profile. Please try again.
        </div>
      </div>
    );
  }

  const total = isCartCheckout
    ? cartItems.reduce((sum, item) => sum + item.price, 0)
    : bookingDetails?.price || 0;
  console.log(bookingDetails);
  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Address Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Delivery Information
          </h1>
          
          {isAddressValid && !isEditing ? (
            <AddressDisplay 
              userProfile={userProfile} 
              onEdit={() => setIsEditing(true)}
            />
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {isEditing ? "Edit Delivery Details" : "Enter Delivery Details"}
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
        </div>

        {/* Order Summary Section */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {isCartCheckout && (
              // Cart checkout summary
              <>
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between p-4 border-b border-zinc-800">
                    <div className="flex flex-col">
                      <span className="text-white">{item.itemName}</span>
                      <span className="text-zinc-400 text-sm">
                      {new Date(item.date).toLocaleDateString()} - {item.timeSlot}
                      </span>
                    </div>
                    <span className="text-white">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </>
            )}

            {isDirectCheckout && bookingDetails && (
              // Single item checkout summary
              <>
                <div className="flex justify-between p-4 border-b border-zinc-800">
                  <span className="text-zinc-400">Item:</span>
                  <span className="text-white">{bookingDetails.itemName}</span>
                </div>
                <div className="flex justify-between p-4 border-b border-zinc-800">
                  <span className="text-zinc-400">Date:</span>
                  <span className="text-white">{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between p-4 border-b border-zinc-800">
                  <span className="text-zinc-400">Time:</span>
                  <span className="text-white">{bookingDetails.timeSlot}</span>
                </div>
              </>
            )}

            {/* Total Amount */}
            <div className="flex justify-between p-4 text-lg font-bold">
              <span className="text-white">Total Amount:</span>
              <span className="text-purple-400">
                ₹{total.toLocaleString()}
              </span>
            </div>

            {/* Payment Button */}
            <button
              className="w-full bg-white text-black py-3 rounded-xl font-semibold
                hover:bg-zinc-200 transition-colors duration-200 
                disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
              
              disabled={!isLoggedIn || !isAddressValid || isEditing}
            >
              {!isLoggedIn 
                ? "Please Log In to Continue"
                : !isAddressValid 
                ? "Please Add Delivery Address"
                : isEditing
                ? "Please Save Address to Continue"
                : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;