import { MapPin } from "lucide-react";

export const LocationDisplay = ({ selectedCity, onChange }) => (
  <div className="flex items-center gap-3 text-[#2D3436] px-4 py-3 rounded-xl bg-[#F0F0F0] font-happiness">
    <MapPin className="w-5 h-5 text-[#2D3436]" />
    <span className="font-medium font-secondary">{selectedCity}</span>
    <button
      onClick={onChange}
      className="text-[#FF6B6B] hover:text-[#2D3436] transition-colors"
    >
      Change
    </button>
  </div>
);

export default LocationDisplay;