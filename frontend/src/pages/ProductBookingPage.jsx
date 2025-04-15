import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  setCheckoutDetails,
} from "../store/cartSlice";
import { selectIsLoggedIn, showToast } from "../store/appSlice";
import ProductImageCard from "../components/product-booking/ProductImageCard";
import PriceCard from "../components/product-booking/PriceCard";
import ProductInfoCard from "../components/product-booking/ProductInfoCard";
import TimeSlotSelector from "../components/product-booking/TimeSlotSelector";
import ValidationStatus from "../components/product-booking/ValidationStatus";
import Loading from "../components/ui/Loading";

const ProductBookingPage = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
        dispatch(
          showToast({
            message: "Failed to load item details. Please try again.",
            type: "ERROR",
          })
        );
      },
    }
  );

  useEffect(() => {
    if (cartError) {
      dispatch(
        showToast({
          message: cartError,
          type: "ERROR",
        })
      );
      dispatch(clearCartError());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (lastAddedItem) {
      dispatch(
        showToast({
          message: "Item added to cart successfully",
          type: "SUCCESS",
        })
      );
      dispatch(clearLastAddedItem());
    }
  }, [lastAddedItem, dispatch]);

  const locationPrice = item?.prices?.find((p) => p.city === selectedCity)?.price;

  const handleDateChange = useCallback(
    (e) => {
      const selectedDate = e.target.value;
      const today = new Date().toISOString().split("T")[0];

      if (selectedDate < today) {
        dispatch(
          showToast({
            message: "Please select a future date",
            type: "ERROR",
          })
        );
        setSelectedDate("");
        return;
      }

      setSelectedDate(selectedDate);
      setSelectedSlot(null);
    },
    [dispatch]
  );

  const handlePincodeSubmit = useCallback((newPincode) => {
    setPincode(newPincode);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      dispatch(
        showToast({
          message: "Please log in to add items to cart",
          type: "ERROR",
        })
      );
      return;
    }

    if (!selectedDate || !selectedSlot || !pincode) {
      dispatch(
        showToast({
          message: "Please complete all required fields",
          type: "ERROR",
        })
      );
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
      dispatch(
        showToast({
          message: getValidationMessage(),
          type: "ERROR",
        })
      );
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

    if (!isLoggedIn) {
      // Save only the booking details in state
      navigate("/login", {
        state: {
          bookingDetails,
          fromBooking: true, // Explicitly set target
        },
      });
      return;
    }
    localStorage.setItem("checkoutType", "direct");
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    dispatch(
      setCheckoutDetails({
        type: "direct",
        bookingDetails,
      })
    );

    navigate("/checkout", {
      state: { bookingDetails },
    });
  }, [
    selectedDate,
    selectedSlot,
    pincode,
    id,
    item,
    navigate,
    locationPrice,
    dispatch,
    isLoggedIn,
  ]);

  const getValidationMessage = () => {
    if (!selectedDate) return "Please select a date";
    if (!selectedSlot) return "Please select a time slot";
    if (!pincode) return "Please enter and submit a pincode";
    return null;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
        <div className="text-center text-[#FF6B6B]">
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
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white">
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

          <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-icon" />
              <span className="font-semibold text-primary">Select Date</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 mb-6 bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] rounded-lg 
              focus:outline-hidden focus:ring-2 focus:ring-hover1"
            />

            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-icon" />
              <span className="font-semibold text-primary">Select Time Slot</span>
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
                  disabled={
                    !selectedDate ||
                    !selectedSlot ||
                    !pincode ||
                    cartLoading ||
                    !isLoggedIn
                  }
                  className="w-full bg-background text-primary font-primary p-3 rounded-xl 
          hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointer
                    disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50 disabled:cursor-not-allowed"
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
                  className="w-full bg-background text-primary font-primary p-3 rounded-xl 
          hover:bg-white transition-colors 
          hover:shadow-lg hover:shadow-[#9333EA]/20 cursor-pointer
                    disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50 disabled:cursor-not-allowed"
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