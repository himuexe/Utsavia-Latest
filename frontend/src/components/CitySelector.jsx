import React from 'react';
import { X } from 'lucide-react';
import useCitySelector from '../hooks/useCitySelector'; 
import { useAppContext } from "../contexts/AppContext"; 

const CitySelector = ({ onClose, isOpen }) => {
  if (!isOpen) return null; 

  const { selectedCity, cities,  } = useCitySelector();
  const { setSelectedCity } = useAppContext(); 

  const handleCitySelection = (city) => {
    setSelectedCity(city); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="max-w-2xl mx-auto p-6 bg-sky-50 rounded-2xl shadow-lg border border-purple-200 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-slate-700 font-primary">
            Select Your City
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-purple-600" />
          </button>
        </div>
        
        <p className="text-slate-600 mb-6 font-secondary">
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
                  ? 'bg-white text-purple-700 border border-purple-400' 
                  : 'bg-sky-50 backdrop-blur-sm border border-purple-200 text-slate-700 hover:bg-white hover:text-purple-700 hover:border-purple-400 font-happiness'
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