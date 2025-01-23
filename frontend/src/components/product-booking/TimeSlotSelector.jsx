import React from 'react';

const TimeSlotSelector = ({ slots = [], selectedSlot, onSelect }) => (
  <div className="grid grid-cols-3 gap-2 mb-6">
    {slots.length > 0 ? (
      slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`p-2 rounded-lg text-sm ${
            selectedSlot === slot
              ? "bg-[#FF6B6B] text-white" // Coral Pink for selected slot
              : "bg-[#F0F0F0] text-[#2D3436] hover:bg-[#FFD166]" // Light Gray for unselected, Pastel Yellow on hover
          } transition-colors duration-200`} // Smooth transition for hover effects
        >
          {slot}
        </button>
      ))
    ) : (
      <p className="col-span-3 text-center text-[#666]"> {/* Subtle gray for no slots message */}
        No time slots available
      </p>
    )}
  </div>
);

export default TimeSlotSelector;