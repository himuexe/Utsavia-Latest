import React from 'react';
import { X } from 'lucide-react';
import useCitySelector from '../../hooks/useCitySelector';
import { useDispatch } from 'react-redux';
import { setSelectedCity } from '../../store/appSlice';

const CitySelector = ({ onClose, isOpen }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { selectedCity, cities } = useCitySelector();

  const handleCitySelection = (city) => {
    dispatch(setSelectedCity(city));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-[#F0F0F0] z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl  text-secondary font-primary">
            Select Your City
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F0F0F0] rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-icon hover:text-hover1" />
          </button>
        </div>

        <p className="text-primary mb-6 font-secondary">
          Find more than 3000 decorations, gifts, and surprises!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelection(city)}
              className={`
                p-3 rounded-xl text-sm font-medium transition-all font-primary
                ${
                  selectedCity === city
                    ? 'border-hover1 text-hover1 border '
                    : 'bg-[#F0F0F0] border border-[#F0F0F0] text-primary hover:bg-white hover:border-hover1 hover:text-hover1'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySelector;