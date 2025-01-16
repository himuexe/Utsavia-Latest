import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './appSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    cart: cartReducer,
  },
});