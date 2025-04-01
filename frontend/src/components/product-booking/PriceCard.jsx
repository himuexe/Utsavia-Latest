import React, { useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import * as apiClient from "../../api/ItemApi";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/appSlice";

const PriceCard = ({ prices, selectedCity, onPincodeSubmit }) => {
  const [pincode, setPincode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const locationPrice = prices?.find((p) => p.city === selectedCity)?.price;

  const handleSubmit = useCallback(async () => {
    if (!pincode.trim()) {
      dispatch(
        showToast({
          message: "Please enter a pincode",
          type: "ERROR",
        })
      );
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      dispatch(
        showToast({
          message: "Please enter a valid 6-digit pincode",
          type: "ERROR",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiClient.validatePincode(pincode);

      if (data && data.Status === "Success" && data.PostOffice?.length > 0) {
        const pincodeDistrict = data.PostOffice[0].District.toLowerCase();
        const currentLocationNormalized = selectedCity.toLowerCase();

        if (
          pincodeDistrict.includes(currentLocationNormalized) ||
          currentLocationNormalized.includes(pincodeDistrict)
        ) {
          setIsSubmitted(true);
          onPincodeSubmit?.(pincode);
          dispatch(
            showToast({
              message: `Pincode verified for ${selectedCity}!`,
              type: "SUCCESS",
            })
          );
        } else {
          dispatch(
            showToast({
              message: `This pincode is for ${data.PostOffice[0].District}, not for ${selectedCity}. Please enter a pincode for ${selectedCity}.`,
              type: "ERROR",
            })
          );
          setIsSubmitted(false);
        }
      } else {
        dispatch(
          showToast({
            message: "Invalid pincode. Please enter a valid pincode.",
            type: "ERROR",
          })
        );
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error("Error validating pincode:", err);
      dispatch(
        showToast({
          message: "Unable to validate pincode. Please try again.",
          type: "ERROR",
        })
      );
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [pincode, selectedCity, onPincodeSubmit, dispatch]);

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-[#FF6B6B]">
            {locationPrice
              ? `₹${locationPrice.toLocaleString()}`
              : "Price unavailable for this location"}
          </span>
          <div className="relative flex-1 ml-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.slice(0, 6));
                  setIsSubmitted(false);
                }}
                placeholder="Enter Pincode"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-[#F9F9F9] text-[#2D3436] border border-[#F0F0F0] rounded-lg 
                focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B] 
                disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50"
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg 
                hover:bg-[#FF6B6B]/90 transition-colors
                disabled:bg-[#F0F0F0] disabled:text-[#2D3436]/50"
              >
                {isSubmitting ? "Checking..." : "Submit"}
              </button>
            </div>
            <MapPin className="absolute right-24 top-2.5 text-[#2D3436]/50" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;