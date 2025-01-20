import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import * as apiClient from "../api/ItemApi";
import {
  selectCartError,
  selectCartLoading,
  selectLastAddedItem,
  clearLastAddedItem,
  addToCart,
  clearCartError,
} from "../store/cartSlice";
import { selectIsLoggedIn, showToast } from "../store/appSlice";
import ProductImageCard from "../components/product-booking/ProductImageCard";
import PriceCard from "../components/product-booking/PriceCard";
import ProductInfoCard from "../components/product-booking/ProductInfoCard";
import TimeSlotSelector from "../components/product-booking/TimeSlotSelector";
import ValidationStatus from "../components/product-booking/ValidationStatus";

const ProductBookingPage = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pincode, setPincode] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const lastAddedItem = useSelector(selectLastAddedItem);

  const { data: item, isLoading, isError } = useQuery(
    ["item", id, selectedCity],
    () => apiClient.getItem(id, selectedCity),
    {
      retry: 2,
      staleTime: 300000,
      onError: (err) => {
        console.error("Failed to fetch item:", err);
        dispatch(showToast({
          message: "Failed to load item details. Please try again.",
          type: "ERROR"
        }));
      },
    }
  );

  useEffect(() => {
    if (cartError) {
      dispatch(showToast({
        message: cartError,
        type: "ERROR",
      }));
      dispatch(clearCartError());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (lastAddedItem) {
      dispatch(showToast({
        message: "Item added to cart successfully",
        type: "SUCCESS",
      }));
      dispatch(clearLastAddedItem());
    }
  }, [lastAddedItem, dispatch]);

  const locationPrice = item?.prices?.find(
    (p) => p.city === selectedCity
  )?.price;

  const handleDateChange = useCallback((e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate < today) {
      dispatch(showToast({
        message: "Please select a future date",
        type: "ERROR"
      }));
      setSelectedDate("");
      return;
    }

    setSelectedDate(selectedDate);
    setSelectedSlot(null);
  }, [dispatch]);

  const handlePincodeSubmit = useCallback((newPincode) => {
    setPincode(newPincode);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      dispatch(showToast({
        message: "Please log in to add items to cart",
        type: "ERROR"
      }));
      return;
    }

    if (!selectedDate || !selectedSlot || !pincode) {
      dispatch(showToast({
        message: "Please complete all required fields",
        type: "ERROR"
      }));
      return;
    }

    const cartItem = {
      itemId: id,
      itemName: item?.name,
      price: locationPrice,
      date: selectedDate,
      timeSlot: selectedSlot,
      pincode: pincode,
      imageUrl: item?.image,
      city: selectedCity,
    };

    await dispatch(addToCart(cartItem));
  }, [
    dispatch,
    isLoggedIn,
    selectedDate,
    selectedSlot,
    pincode,
    id,
    item,
    locationPrice,
    selectedCity,
  ]);

  const handleBooking = useCallback(() => {
    if (!selectedDate || !selectedSlot || !pincode) {
      dispatch(showToast({
        message: getValidationMessage(),
        type: "ERROR"
      }));
      return;
    }

    const bookingDetails = {
      itemId: id,
      itemName: item?.name,
      price: locationPrice,
      date: selectedDate,
      timeSlot: selectedSlot,
      pincode: pincode,
      imageUrl: item?.image,
    };

    navigate("/checkout", {
      state: { bookingDetails },
    });
  }, [selectedDate, selectedSlot, pincode, id, item, navigate, locationPrice, dispatch]);

  const getValidationMessage = () => {
    if (!selectedDate) return "Please select a date";
    if (!selectedSlot) return "Please select a time slot";
    if (!pincode) return "Please enter and submit a pincode";
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Item not available at this location. Please try again later.
        </div>
      </div>
    );
  }

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="h-[400px] lg:h-auto">
          <ProductImageCard imageUrl={item?.image} />
        </div>

        <div>
          <PriceCard
            prices={item?.prices}
            selectedCity={selectedCity}
            onPincodeSubmit={handlePincodeSubmit}
          />
          <ProductInfoCard name={item?.name} description={item?.description} />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-purple-600" />
              <span className="font-semibold">Select Date</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 mb-6 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none"
            />

            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-purple-600" />
              <span className="font-semibold">Select Time Slot</span>
            </div>

            <TimeSlotSelector
              slots={timeSlots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />

            <div className="space-y-4">
              <ValidationStatus 
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                pincode={pincode}
              />
              
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedDate || !selectedSlot || !pincode || cartLoading || !isLoggedIn}
                  className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold
                    hover:bg-purple-50 transition-colors duration-200 disabled:bg-gray-100 
                    disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {cartLoading
                    ? "Adding to Cart..."
                    : isLoggedIn
                    ? "Add to Cart"
                    : "Login to Add to Cart"}
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedSlot || !pincode}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold
                    hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400 
                    disabled:cursor-not-allowed"
                >
                  {!selectedDate || !selectedSlot || !pincode
                    ? `Complete Required Fields to Continue`
                    : `Proceed to Checkout`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBookingPage;