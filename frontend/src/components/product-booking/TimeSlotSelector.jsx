import React from 'react';

const TimeSlotSelector = ({ slots = [], selectedSlot, onSelect }) => (
  <div className="grid grid-cols-3 gap-2 mb-6">
    {slots.length > 0 ? (
      slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`p-2 rounded-lg text-sm font-primary ${
            selectedSlot === slot
              ? "border-hover1 text-hover1 border" // Coral Pink for selected slot
              : "g-[#F0F0F0] border border-[#F0F0F0] text-primary hover:bg-white hover:border-hover1 hover:text-hover1" // Light Gray for unselected, Pastel Yellow on hover
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