import { MapPin } from "lucide-react";

export const LocationDisplay = ({ selectedCity, onChange }) => (
  <div className="flex items-center text-center gap-3 text-[#2D3436] px-4 py-3 rounded-xl bg-[#F0F0F0] font-primary">
    <MapPin className="w-5 h-5 text-icon" />
    <span className="font-medium font-secondary text-secondary">{selectedCity}</span>
    <button
      onClick={onChange}
      className="text-primary hover:text-hover1 hover:underline transition-colors cursor-pointer "
    >
      Change
    </button>
  </div>
);

export default LocationDisplay;