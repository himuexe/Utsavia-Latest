import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import * as apiClient from '../api/MyUserApi';
import { 
  setLoading, 
  setLoggedIn,
  selectToast,
  clearToast
} from '../store/appSlice';
import Toast from '../components/ui/Toast';

function AppContent({ children }) {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

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