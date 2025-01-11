import { useAppContext } from "../contexts/AppContext";

const useCitySelector = () => {
    const { selectedCity, setSelectedCity } = useAppContext();

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
    setSelectedCity(city);
  };

  return {
    selectedCity,
    cities,
    handleCityClick,
  };
};

export default useCitySelector;
