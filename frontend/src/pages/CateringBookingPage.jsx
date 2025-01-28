import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, Clock, UtensilsCrossed } from "lucide-react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import * as apiClient from "../api/CateringApi";
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
import PriceCard from "../components/product-booking/PriceCard";
import TimeSlotSelector from "../components/product-booking/TimeSlotSelector";
import ValidationStatus from "../components/product-booking/ValidationStatus";
import Loading from "../components/ui/Loading";

const MenuSelector = ({ category, selectedItems, onItemSelect }) => {
  const { data: menuItems, isLoading } = useQuery(
    ["menuItems", category],
    () => apiClient.getMenuItems(category)
  );

  if (isLoading) return <div>Loading menu items...</div>;

  return (
    <div className="space-y-2">
      {menuItems?.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItems.some(selected => selected.id === item.id)}
              onChange={() => onItemSelect(item)}
              className="rounded text-[#FF6B6B]"
            />
            <span>{item.name}</span>
          </label>
          <span className="text-sm text-gray-600">${item.price}</span>
        </div>
      ))}
    </div>
  );
};

const CateringBookingPage = ({ selectedCity }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestCount, setGuestCount] = useState("");
  const [selectedMenuItems, setSelectedMenuItems] = useState({
    starters: [],
    mainCourse: [],
    desserts: [],
    drinks: []
  });
  const [eventType, setEventType] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const lastAddedItem = useSelector(selectLastAddedItem);

  const { data: packageDetails, isLoading } = useQuery(
    ["cateringPackage", id, selectedCity],
    () => apiClient.getCateringItem(id, selectedCity)
  );

  useEffect(() => {
    if (cartError) {
      dispatch(showToast({ message: cartError, type: "ERROR" }));
      dispatch(clearCartError());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (lastAddedItem) {
      dispatch(showToast({
        message: "Catering package added to cart successfully",
        type: "SUCCESS"
      }));
      dispatch(clearLastAddedItem());
    }
  }, [lastAddedItem, dispatch]);

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

  const handleMenuItemSelect = useCallback((category, item) => {
    setSelectedMenuItems(prev => ({
      ...prev,
      [category]: prev[category].some(i => i.id === item.id)
        ? prev[category].filter(i => i.id !== item.id)
        : [...prev[category], item]
    }));
  }, []);

  const calculateTotalPrice = useCallback(() => {
    const basePrice = packageDetails?.basePrice || 0;
    const itemsTotal = Object.values(selectedMenuItems)
      .flat()
      .reduce((sum, item) => sum + item.price, 0);
    return basePrice + itemsTotal;
  }, [selectedMenuItems, packageDetails]);

  const handleAddToCart = useCallback(async () => {
    if (!isLoggedIn) {
      dispatch(showToast({
        message: "Please log in to add packages to cart",
        type: "ERROR"
      }));
      return;
    }

    const cartItem = {
      packageId: id,
      eventDetails: {
        date: selectedDate,
        timeSlot: selectedSlot,
        guestCount: parseInt(guestCount),
        eventType
      },
      menuItems: selectedMenuItems,
      totalAmount: calculateTotalPrice(),
      city: selectedCity
    };

    await dispatch(addToCart(cartItem));
  }, [
    dispatch,
    id,
    selectedDate,
    selectedSlot,
    guestCount,
    eventType,
    selectedMenuItems,
    calculateTotalPrice,
    selectedCity,
    isLoggedIn
  ]);

  const handleBooking = useCallback(() => {
    const bookingDetails = {
      packageId: id,
      eventDetails: {
        date: selectedDate,
        timeSlot: selectedSlot,
        guestCount: parseInt(guestCount),
        eventType
      },
      menuItems: selectedMenuItems,
      totalAmount: calculateTotalPrice(),
      city: selectedCity
    };

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          bookingDetails,
          fromBooking: true,
        },
      });
      return;
    }

    localStorage.setItem("checkoutType", "direct");
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    dispatch(setCheckoutDetails({
      type: "direct",
      bookingDetails,
    }));

    navigate("/checkout", { state: { bookingDetails } });
  }, [
    id,
    selectedDate,
    selectedSlot,
    guestCount,
    eventType,
    selectedMenuItems,
    calculateTotalPrice,
    selectedCity,
    isLoggedIn,
    navigate,
    dispatch
  ]);

  if (isLoading) return <Loading />;

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ];

  const eventTypes = [
    "Wedding",
    "Corporate Event",
    "Birthday Party",
    "Anniversary",
    "Other"
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <PriceCard
          basePrice={packageDetails?.basePrice}
          selectedCity={selectedCity}
        />

        <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 shadow-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#FF6B6B]" />
              <span className="font-semibold text-[#2D3436]">Event Details</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />

            <div className="flex items-center gap-2">
              <Clock className="text-[#FF6B6B]" />
              <span className="font-semibold text-[#2D3436]">Select Time Slot</span>
            </div>

            <TimeSlotSelector
              slots={timeSlots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />

            <div className="flex items-center gap-2">
              <Users className="text-[#FF6B6B]" />
              <span className="font-semibold text-[#2D3436]">Guest Count</span>
            </div>

            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="Number of guests"
              min="1"
              className="w-full p-2 bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] rounded-lg"
            />

            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-2 bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] rounded-lg"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="text-[#FF6B6B]" />
              <span className="font-semibold text-[#2D3436]">Select Menu Items</span>
            </div>

            <div className="space-y-6">
              {["starters", "mainCourse", "desserts", "drinks"].map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium text-[#2D3436] capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <MenuSelector
                    category={category}
                    selectedItems={selectedMenuItems[category]}
                    onItemSelect={(item) => handleMenuItemSelect(category, item)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <ValidationStatus
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              guestCount={guestCount}
              eventType={eventType}
              menuItems={selectedMenuItems}
            />

            <div className="text-xl font-semibold text-[#2D3436] text-right">
              Total: ${calculateTotalPrice()}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedDate || !selectedSlot || !guestCount || !eventType || cartLoading || !isLoggedIn}
                className="w-full bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold
                  hover:bg-[#FF6B6B]/90 transition-colors duration-200 
                  disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50 disabled:cursor-not-allowed"
              >
                {cartLoading ? "Adding to Cart..." : isLoggedIn ? "Add to Cart" : "Login to Add to Cart"}
              </button>
              
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedSlot || !guestCount || !eventType}
                className="w-full bg-[#FFD166] text-[#2D3436] py-3 rounded-lg font-semibold
                  hover:bg-[#FFD166]/90 transition-colors duration-200 
                  disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50 disabled:cursor-not-allowed"
              >
                {!selectedDate || !selectedSlot || !guestCount || !eventType
                  ? `Complete Required Fields to Continue`
                  : `Proceed to Checkout`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringBookingPage;