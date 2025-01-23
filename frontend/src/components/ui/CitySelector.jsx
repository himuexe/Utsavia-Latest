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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-[#F0F0F0] z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2D3436] font-primary">
            Select Your City
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F0F0F0] rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#2D3436] hover:text-[#FF6B6B]" />
          </button>
        </div>

        <p className="text-[#2D3436] mb-6 font-secondary">
          Find more than 3000 decorations, gifts, and surprises!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelection(city)}
              className={`
                p-3 rounded-xl text-sm font-medium transition-all
                ${
                  selectedCity === city
                    ? 'bg-[#FF6B6B] text-white border border-[#FF6B6B]'
                    : 'bg-[#F0F0F0] border border-[#F0F0F0] text-[#2D3436] hover:bg-[#FF6B6B] hover:text-white font-happiness'
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