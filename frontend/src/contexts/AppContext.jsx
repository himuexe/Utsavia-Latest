import React, { useContext, useState ,useEffect } from "react";
import Toast from "../components/ui/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api/MyUserApi";

const AppContext = React.createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "";
  });
  const currentLocation = selectedCity || "";
  
  const { isError, isLoading: isValidatingToken } = useQuery(
    "validateToken", 
    apiClient.validateToken, 
    {
      retry: false,
      onSettled: () => {
        setIsLoading(false);
      }
    }
  );
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity);
    } else {
      localStorage.removeItem("selectedCity");
    }
  }, [selectedCity]);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        isLoading: isLoading || isValidatingToken,
        currentLocation,
        setSelectedCity
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};