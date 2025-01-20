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
              ? "bg-purple-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {slot}
        </button>
      ))
    ) : (
      <p className="col-span-3 text-center text-zinc-500">
        No time slots available
      </p>
    )}
  </div>
);

export default TimeSlotSelector;