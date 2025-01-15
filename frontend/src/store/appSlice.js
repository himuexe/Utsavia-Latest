import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: undefined,
  isLoading: true,
  isLoggedIn: false,
  selectedCity: localStorage.getItem('selectedCity') || '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = undefined;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedCity', action.payload);
      } else {
        localStorage.removeItem('selectedCity');
      }
    },
  },
});

export const {
  showToast,
  clearToast,
  setLoading,
  setLoggedIn,
  setSelectedCity,
} = appSlice.actions;

// Selectors
export const selectToast = (state) => state.app.toast;
export const selectIsLoading = (state) => state.app.isLoading;
export const selectIsLoggedIn = (state) => state.app.isLoggedIn;
export const selectSelectedCity = (state) => state.app.selectedCity;