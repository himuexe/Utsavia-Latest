import React from 'react';
import { X } from 'lucide-react';
import useCitySelector from '../../hooks/useCitySelector'; 
import {  useDispatch } from 'react-redux';
import { setSelectedCity } from '../../store/appSlice';

const CitySelector = ({ onClose, isOpen }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const { selectedCity, cities } = useCitySelector();
  
  const handleCitySelection = (city) => {
    dispatch(setSelectedCity(city));
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/90" onClick={onClose} />
      <div className="max-w-2xl mx-auto p-6 bg-black rounded-2xl shadow-lg border border-zinc-800 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white font-primary">
            Select Your City
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-zinc-900 rounded-full transition-colors"
          >
            <X className=" w-6 text-white hover:text-purple-300" />
          </button>
        </div>
        
        <p className="text-white mb-6 font-secondary">
          Find more than 3000 decorations, gifts, and surprises!
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelection(city)} 
              className={`
                p-3 rounded-xl text-sm font-medium transition-all
                ${selectedCity === city 
                  ? 'bg-white text-black border border-white' 
                  : 'bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black font-happiness'
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