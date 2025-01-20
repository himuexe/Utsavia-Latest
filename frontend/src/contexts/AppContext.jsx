import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import * as apiClient from '../api/MyUserApi';
import { 
  setLoading, 
  setLoggedIn,
  selectToast,
  clearToast,
  setAddressValidity // Assuming you have an action to set address validity
} from '../store/appSlice';
import Toast from '../components/ui/Toast';

function AppContent({ children }) {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const isLoggedIn = useSelector(state => state.app.isLoggedIn); // Assuming you have this in your state
  const [isAddressValid, setIsAddressValid] = useState(null); // State to hold address validity

  const { isError, isLoading: isValidatingToken } = useQuery(
    'validateToken',
    apiClient.validateToken,
    {
      retry: false,
      onSettled: () => {
        dispatch(setLoading(false));
      },
    }
  );

  useEffect(() => {
    dispatch(setLoggedIn(!isError));
  }, [isError, dispatch]);

  // Check profile completion when the component mounts or when the user logs in
  useEffect(() => {
    const checkProfile = async () => {
      if (isLoggedIn) {
        try {
          const isComplete = await apiClient.checkProfileCompletion();
          console.log("isComplete:", isComplete);
          setIsAddressValid(isComplete === "" ? false : isComplete);
          dispatch(setAddressValidity(isComplete === "" ? false : isComplete)); // Dispatch to store if needed
        } catch (error) {
          console.error("Error checking profile completion:", error);
          setIsAddressValid(false); // Handle error case
          dispatch(setAddressValidity(false)); // Dispatch to store if needed
        }
      }
    };

    checkProfile();
  }, [isLoggedIn, dispatch]);

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(clearToast())}
        />
      )}
      {children}
    </>
  );
}

export default AppContent;