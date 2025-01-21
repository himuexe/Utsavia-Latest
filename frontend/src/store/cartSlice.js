// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for cart operations
export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart items');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (itemDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemDetails)
      });
      
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Failed to add item to cart");
    }
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const clearCartFromServer = createAsyncThunk(
  'cart/clearCartFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) throw new Error('Failed to clear cart');
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) throw new Error('Failed to remove item from cart');
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastAddedItem: null,
    checkoutType: null,  // 'cart' or 'direct'
    bookingDetails: null // for direct checkout
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    clearLastAddedItem: (state) => {
      state.lastAddedItem = null;
    },
    setCheckoutDetails: (state, action) => {
      state.checkoutType = action.payload.type;
      state.bookingDetails = action.payload.bookingDetails;
    },
    clearCheckoutDetails: (state) => {
      state.checkoutType = null;
      state.bookingDetails = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
      state.lastAddedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.lastAddedItem = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCartFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartFromServer.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.lastAddedItem = null;
      })
      .addCase(clearCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearCartError, 
  clearLastAddedItem, 
  clearCart,
  setCheckoutDetails,
  clearCheckoutDetails 
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectLastAddedItem = (state) => state.cart.lastAddedItem;
export const selectCartItemsCount = (state) => state.cart.items.length;
export const selectCheckoutType = (state) => state.cart.checkoutType;
export const selectBookingDetails = (state) => state.cart.bookingDetails;

export default cartSlice.reducer;