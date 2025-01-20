import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/appSlice";
import Login from "./Login";
import ProfilePage from "./ProfilePage";
import { selectIsAddressValid } from "../store/appSlice";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAddressValid = useSelector(selectIsAddressValid);
  console.log(isAddressValid)
  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!isLoggedIn ? (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
            <div className="">
              <h1 className="text-3xl font-bold text-slate-700 font-primary mb-6">
                Sign In to Checkout
              </h1>
              <Login />
            </div>
          </div>
        ) : null}

        {isAddressValid === false ? ( // Check if address is not valid
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
            <div className="">
              <h1 className="text-3xl font-bold text-slate-700 font-primary mb-6">
                Add your details to checkout
              </h1>
              <ProfilePage />
            </div>
          </div>
        ) : null}

        {/* Right Column: Checkout Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
          <h1 className="text-3xl font-bold text-center text-slate-700 font-primary mb-6">
            Checkout Summary
          </h1>

          <div className="space-y-4">
            <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-md">
              <span className="font-semibold text-gray-700">Item:</span>
              <span className="text-gray-600">{bookingDetails.itemName}</span>
            </div>

            <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-md">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-600">{bookingDetails.date}</span>
            </div>

            <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-md">
              <span className="font-semibold text-gray-700">Time:</span>
              <span className="text-gray-600">{bookingDetails.timeSlot}</span>
            </div>

            <div className="flex justify-between bg-gray-100 rounded-lg p-4 shadow-md">
              <span className="font-semibold text-gray-700">
                Delivery Pincode:
              </span>
              <span className="text-gray-600">{bookingDetails.pincode}</span>
            </div>

            <div className="flex justify-between text-lg font-bold bg-gray-100 rounded-lg p-4 shadow-md">
              <span>Total Amount:</span>
              <span className="text-purple-600">
                ₹{bookingDetails.price?.toLocaleString()}
              </span>
            </div>

            <button
              className={`w-full font-happiness bg-gradient-to-r from-purple-600 to-pink -600 text-white py-3 rounded-lg font-semibold
                hover:bg-purple-700 transition-colors duration-200 mt-6 shadow-lg ${
                  !isLoggedIn || isAddressValid === false ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={() => {
                if (isLoggedIn) {
                  // Add your payment processing logic here
                  console.log("Processing payment...");
                }
              }}
              disabled={!isLoggedIn || isAddressValid === false}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;