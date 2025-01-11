import { MapPin } from "lucide-react";
export const LocationDisplay = ({ currentLocation, onChange }) => (
    <div className="flex items-center gap-3 text-gray-700 px-4 py-3 rounded-xl bg-white/50  font-happiness">
      <MapPin className="w-5 h-5 text-purple-600" />
      <span className="font-medium font-secondary">{currentLocation}</span>
      <button onClick={onChange} className="text-purple-600 hover:underline ">
        Change
      </button>
    </div>
  );
  export default LocationDisplay