import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Elements } from "@stripe/react-stripe-js";
import * as apiClient from "../api/MyUserApi";
import * as itemApiClient from "../api/ItemApi"; 
import {
  selectCartItems,
  selectCheckoutType,
  selectBookingDetails,
} from "../store/cartSlice";
import { selectIsAddressValid, selectIsLoggedIn } from "../store/appSlice";
import { useCheckout } from "../hooks/useCheckout";
import AddressForm from "../components/checkout/AddressForm";
import AddressDisplay from "../components/checkout/AddressDisplay";
import PaymentForm from "../components/checkout/PaymentForm";
import OrderSummaryItem from "../components/checkout/OrderSummaryItem";
import CheckoutButton from "../components/checkout/CheckoutButton";
import Loading from "../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { showToast } from "../store/appSlice";

const CheckoutPage = ({selectedCity}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [isPincodeChecking, setIsPincodeChecking] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const isAddressValid = useSelector(selectIsAddressValid);
  const cartItems = useSelector(selectCartItems);
  const checkoutType = useSelector(selectCheckoutType);
  const bookingDetails = useSelector(selectBookingDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    if (checkoutType === "direct" && !bookingDetails) {
      navigate("/");
    } else if (checkoutType === "cart" && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [checkoutType, bookingDetails, cartItems, navigate]);

  const {
    paymentState,
    stripePromise,
    handleProceedToPayment,
    handlePaymentSuccess,
  } = useCheckout(cartItems, checkoutType, bookingDetails);

  const {
    data: userProfile,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useQuery("currentUser", apiClient.fetchCurrentUser, {
    enabled: isLoggedIn,
    retry: 2,
  });

  const validatePincode = async (pincode, city) => {
    if (!pincode.trim()) {
      dispatch(showToast({ message: "Please enter a pincode", type: "ERROR" }));
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      dispatch(showToast({ message: "Please enter a valid 6-digit pincode", type: "ERROR" }));
      return false;
    }

    setIsPincodeChecking(true);

    try {
      const data = await itemApiClient.validatePincode(pincode);

      if (data && data.Status === "Success" && data.PostOffice?.length > 0) {
        const pincodeDistrict = data.PostOffice[0].District.toLowerCase();
        const currentLocationNormalized = city.toLowerCase();

        if (
          pincodeDistrict.includes(currentLocationNormalized) ||
          currentLocationNormalized.includes(pincodeDistrict)
        ) {
          setIsPincodeValid(true);
          dispatch(showToast({ message: `Pincode verified for ${city}!`, type: "SUCCESS" }));
          return true;
        } else {
          dispatch(showToast({ message: `This pincode is for ${data.PostOffice[0].District}, not for ${city}. Please enter a pincode for ${city}.`, type: "ERROR" }));
          setIsPincodeValid(false);
          return false;
        }
      } else {
        dispatch(showToast({ message: "Invalid pincode. Please enter a valid pincode.", type: "ERROR" }));
        setIsPincodeValid(false);
        return false;
      }
    } catch (err) {
      console.error("Error validating pincode:", err);
      dispatch(showToast({ message: "Unable to validate pincode. Please try again.", type: "ERROR" }));
      setIsPincodeValid(false);
      return false;
    } finally {
      setIsPincodeChecking(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      return;
    }

    const isPincodeValidForCity = await validatePincode(selectedAddress.zipCode, selectedCity);
    if (!isPincodeValidForCity) {
      return;
    }

    handleProceedToPayment(total, paymentMethod, selectedAddress);
  };

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <div className="text-center text-[#FF6B6B]">
          Error loading profile. Please try again.
        </div>
      </div>
    );
  }

  const total =
    checkoutType === "cart"
      ? cartItems.reduce((sum, item) => sum + item.price, 0)
      : bookingDetails?.price || 0;

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
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
          <h1 className="text-4xl  text-primary font-primary mb-6">
            Delivery Information
          </h1>

          {isAddressValid && !isEditing ? (
            <AddressDisplay
              userProfile={userProfile}
              onEdit={() => setIsEditing(true)}
              onSelectAddress={handleSelectAddress}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#2D3436] mb-4">
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
        </motion.div>

        {/* Order Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-[#F0F0F0] p-6 shadow-lg"
        >
          <h2 className="text-3xl  text-secondary font-secondary mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {checkoutType === "cart" &&
              cartItems.map((item) => (
                <OrderSummaryItem
                  key={item._id}
                  label={
                    <div className="flex flex-col">
                      <span>{item.itemName}</span>
                      <span className="text-sm">
                        {new Date(item.date).toLocaleDateString()} -{" "}
                        {item.timeSlot}
                      </span>
                    </div>
                  }
                  value={`₹${item.price.toLocaleString()}`}
                />
              ))}

            {checkoutType === "direct" && bookingDetails && (
              <>
                <OrderSummaryItem
                  label="Item"
                  value={bookingDetails.itemName}
                />
                <OrderSummaryItem label="Date" value={bookingDetails.date} />
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

            <div className="mt-6">
              <label className="block text-sm font-medium text-primary font-primary">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="razorpay">Pay with UPI and Netbank</option>
                <option value="stripe">Pay with Card</option>
                
              </select>
            </div>

            {paymentState.showPayment &&
            paymentState.clientSecret &&
            paymentMethod === "stripe" ? (
              <div className="mt-6">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentState.clientSecret,
                    appearance: {
                      theme: "day",
                      variables: {
                        colorPrimary: "#9333EA",
                      },
                    },
                  }}
                >
                  <PaymentForm
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    selectedAddress={selectedAddress}
                  />
                </Elements>
              </div>
            ) : (
              <CheckoutButton
                isLoggedIn={isLoggedIn}
                isAddressValid={isAddressValid && selectedAddress}
                isEditing={isEditing}
                isProcessing={paymentState.isProcessing || isPincodeChecking}
                onClick={handleProceed}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;