import { useDispatch, useSelector } from 'react-redux';
import { 
  selectSelectedCity,
  setSelectedCity 
} from '../store/appSlice';

const useCitySelector = () => {
    const selectedCity = useSelector(selectSelectedCity);
    const dispatch = useDispatch();

  const cities = [
    "Jaipur",
    "Delhi NCR",
    "Bangalore",
    "Indore",
    "Pune",

    "Hyderabad",
    "Across India",
    "Mumbai",
    "Chennai",

    "Lucknow",
    "Chandigarh",
    "Ahmedabad",
  ];

  const handleCityClick = (city) => {
    dispatch(setSelectedCity(city));
  };

  return {
    selectedCity,
    cities,
    handleCityClick,
  };
};

export default useCitySelector;
