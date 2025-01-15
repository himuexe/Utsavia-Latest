import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from 'react-redux';
import {store}  from './store/store';
import './index.css'
import AppRoutes from './AppRoutes'
import AppContent from './contexts/AppContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <AppContent>
        <AppRoutes />
      </AppContent>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
)
