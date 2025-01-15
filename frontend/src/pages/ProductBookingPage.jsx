import React, { useState, useCallback } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api/ItemApi";
import * as bookingClient from "../api/BookingApi";
import { useQuery } from "react-query";

// Custom Error Banner Component
const ErrorBanner = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
    <span className="block sm:inline">{message}</span>
  </div>
);

// Product Image Card Component
const ProductImageCard = ({ imageUrl }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 h-full">
    <img
      src={imageUrl || "/api/placeholder/600/400"}
      alt="Product"
      className="w-full h-full object-cover rounded-lg"
      onError={(e) => {
        e.target.src = "/api/placeholder/600/400";
      }}
    />
  </div>
);

// Price Card Component
const PriceCard = ({ prices, currentLocation, onPincodeSubmit }) => {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const locationPrice = prices?.find(p => p.city === currentLocation)?.price;

  const handleSubmit = useCallback(async () => {
    if (!pincode.trim()) {
      setError("Please enter a pincode");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = await bookingClient.validatePincode(pincode);
      console.log("API Response:", data); // Debug log

      if (data && data.Status === "Success" && data.PostOffice?.length > 0) {
        const pincodeDistrict = data.PostOffice[0].District.toLowerCase();
        const currentLocationNormalized = currentLocation.toLowerCase();

        console.log("District:", pincodeDistrict); // Debug log
        console.log("Current Location:", currentLocationNormalized); // Debug log

        if (pincodeDistrict.includes(currentLocationNormalized) || 
            currentLocationNormalized.includes(pincodeDistrict)) {
          setIsSubmitted(true);
          onPincodeSubmit?.(pincode);
        } else {
          setError(`This pincode is for ${data.PostOffice[0].District}, not for ${currentLocation}. Please enter a pincode for ${currentLocation}.`);
          setIsSubmitted(false);
        }
      } else {
        setError("Invalid pincode. Please enter a valid pincode.");
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error("Error validating pincode:", err);
      setError("Unable to validate pincode. Please try again.");
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [pincode, currentLocation, onPincodeSubmit]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-slate-700 font-primary">
            {locationPrice ? `₹${locationPrice.toLocaleString()}` : 'Price unavailable for this location'}
          </span>
          <div className="relative flex-1 ml-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.slice(0, 6));
                  setError("");
                  setIsSubmitted(false);
                }}
                placeholder="Enter Pincode"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none disabled:bg-gray-100"
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-purple-600 font-happiness text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
              >
                {isSubmitting ? "Checking..." : "Submit"}
              </button>
            </div>
            <MapPin className="absolute right-24 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isSubmitted && !error && (
          <p className="text-green-500 text-sm">Pincode verified for {currentLocation}!</p>
        )}
      </div>
    </div>
  );
};
// Product Info Card Component
const ProductInfoCard = ({ name, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold mb-2 font-secondary">{name || 'Product Name Unavailable'}</h2>
    <p className="text-gray-600 font-happiness">{description || 'No description available'}</p>
  </div>
);

// Time Slot Selector Component
const TimeSlotSelector = ({ slots = [], selectedSlot, onSelect }) => (
  <div className="grid grid-cols-3 gap-2 mb-6">
    {slots.length > 0 ? (
      slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`p-2 rounded-lg text-sm ${
            selectedSlot === slot
              ? "bg-purple-600 text-white"
              : "bg-white border hover:bg-purple-50"
          }`}
        >
          {slot}
        </button>
      ))
    ) : (
      <p className="col-span-3 text-center text-gray-500">No time slots available</p>
    )}
  </div>
);

// Main Component
const ProductBookingPage = ({ currentLocation }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pincode, setPincode] = useState("");
  const [bookingError, setBookingError] = useState("");

  const { data: item, isLoading, isError } = useQuery(
    ["item", id, currentLocation],
    () => apiClient.getItem(id, currentLocation),
    {
      retry: 2,
      staleTime: 300000,
      onError: (err) => {
        console.error("Failed to fetch item:", err);
      }
    }
  );

  const locationPrice = item?.prices?.find(p => p.city === currentLocation)?.price;

  const handleDateChange = useCallback((e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (selectedDate < today) {
      setBookingError("Please select a future date");
      setSelectedDate("");
      return;
    }
    
    setBookingError("");
    setSelectedDate(selectedDate);
    setSelectedSlot(null);
  }, []);

  const handlePincodeSubmit = useCallback((newPincode) => {
    setPincode(newPincode);
  }, []);

  const handleBooking = useCallback(() => {
    // Validation with specific error messages
    if (!selectedDate) {
      setBookingError("Please select a date");
      return;
    }
    if (!selectedSlot) {
      setBookingError("Please select a time slot");
      return;
    }
    if (!pincode) {
      setBookingError("Please enter and submit a pincode");
      return;
    }

    // Create booking details object
    const bookingDetails = {
      itemId: id,
      itemName: item?.name,
      price: locationPrice,
      date: selectedDate,
      timeSlot: selectedSlot,
      pincode: pincode,
      imageUrl: item?.image
    };
    
    // Navigate to checkout with booking details
    navigate('/checkout', { 
      state: { bookingDetails }
    });
  }, [selectedDate, selectedSlot, pincode, id, item, navigate, locationPrice]);

  // Function to get validation status message
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
        <ErrorBanner message="Item not available at this location. Please try again later." />
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
            currentLocation={currentLocation}
            onPincodeSubmit={handlePincodeSubmit}
          />
          <ProductInfoCard
            name={item?.name}
            description={item?.description}
          />

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-purple-600" />
              <span className="font-semibold">Select Date</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
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

            {(bookingError || getValidationMessage()) && (
              <div className="mb-4">
                <ErrorBanner message={bookingError || getValidationMessage()} />
              </div>
            )}

            <div className="space-y-4">
              {/* Validation Status */}
              <div className="text-sm">
                <div className={`flex items-center ${selectedDate ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-2">✓</span> Date selected
                </div>
                <div className={`flex items-center ${selectedSlot ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-2">✓</span> Time slot selected
                </div>
                <div className={`flex items-center ${pincode ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="mr-2">✓</span> Pincode verified
                </div>
              </div>

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
  );
};

export default ProductBookingPage;