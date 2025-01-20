import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../api/MyUserApi";
import { selectIsLoggedIn, selectIsAddressValid, showToast } from "../store/appSlice";

const AddressForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const mutation = useMutation(apiClient.updateUserProfile, {
    onSuccess: () => {
      dispatch(showToast({ message: 'Address updated successfully', type: 'SUCCESS' }));
      onSuccess?.();
    },
    onError: (error) => {
      dispatch(showToast({ message: error.message, type: 'ERROR' }));
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          className="w-full p-3 rounded-xl border border-zinc-800 
          focus:outline-none focus:ring-2 focus:ring-purple-600 
          bg-zinc-900 text-white placeholder-zinc-500"
          placeholder="Enter your phone number"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && (
          <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Delivery Address
        </label>
        <textarea
          className="w-full p-3 rounded-xl border border-zinc-800 
          focus:outline-none focus:ring-2 focus:ring-purple-600 
          bg-zinc-900 text-white placeholder-zinc-500 min-h-[100px]"
          placeholder="Enter your complete address"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && (
          <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-white text-black py-3 rounded-xl font-semibold
          hover:bg-zinc-200 transition-colors duration-200 
          disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
      >
        {mutation.isLoading ? "Updating..." : "Save Address"}
      </button>
    </form>
  );
};

const AddressDisplay = ({ userProfile }) => {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Delivery Address</h2>
      <div className="space-y-2">
        <p className="text-zinc-400">Phone: {userProfile.phone}</p>
        <p className="text-zinc-400">Address: {userProfile.address}</p>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingDetails } = location.state || {};
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAddressValid = useSelector(selectIsAddressValid);
  console.log('isAddressValid:', isAddressValid);

  const { data: userProfile, refetch: refetchProfile } = useQuery(
    "currentUser",
    apiClient.fetchCurrentUser,
    {
      enabled: isLoggedIn,
      onError: (error) => {
        dispatch(showToast({ message: error.message, type: 'ERROR' }));
      },
    }
  );
  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Address Form or Display */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Delivery Information
          </h1>
          
          {isAddressValid ? (
            <AddressDisplay userProfile={userProfile} />
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Enter Delivery Details</h2>
              <AddressForm onSuccess={refetchProfile} />
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
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

            <div className="flex justify-between p-4 border-b border-zinc-800">
              <span className="text-zinc-400">Delivery Pincode:</span>
              <span className="text-white">{bookingDetails.pincode}</span>
            </div>

            <div className="flex justify-between p-4 text-lg font-bold">
              <span className="text-white">Total Amount:</span>
              <span className="text-purple-400">
                ₹{bookingDetails.price?.toLocaleString()}
              </span>
            </div>

            <button
              className="w-full bg-white text-black py-3 rounded-xl font-semibold
                hover:bg-zinc-200 transition-colors duration-200 
                disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
              onClick={() => {
                if (isLoggedIn && isAddressValid) {
                  // Add your payment processing logic here
                  console.log("Processing payment...");
                }
              }}
              disabled={!isLoggedIn || !isAddressValid}
            >
              {!isLoggedIn 
                ? "Please Log In to Continue"
                : !isAddressValid 
                ? "Please Add Delivery Address"
                : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;