import { MapPin } from "lucide-react";
export const LocationDisplay = ({ selectedCity, onChange }) => (
  <div className="flex items-center gap-3 text-white px-4 py-3 rounded-xl bg-zinc-900 font-happiness">
    <MapPin className="w-5 h-5 text-white" />
    <span className="font-medium font-secondary">{selectedCity}</span>
    <button
      onClick={onChange}
      className="text-purple-300 hover:text-white transition-colors"
    >
      Change
    </button>
  </div>
);
export default LocationDisplay;
