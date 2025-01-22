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
        },
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
      // Ensure the date is in YYYY-MM-DD format
      const formattedItemDetails = {
        ...itemDetails,
        date: itemDetails.date.split('T')[0], // Remove time component if present
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedItemDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${cartItemId}`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error('Failed to update item quantity');
      return response.json();
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
        },
      });

      if (!response.ok) throw new Error('Failed to remove item from cart');
      return cartItemId;
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
        },
      });

      if (!response.ok) throw new Error('Failed to clear cart');
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
  loading: false,
  error: null,
  lastAddedItem: null,
  checkoutType: localStorage.getItem('checkoutType') || null,
  bookingDetails: JSON.parse(localStorage.getItem('bookingDetails')) || null,
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
      localStorage.setItem('checkoutType', action.payload.type);
      localStorage.setItem('bookingDetails', JSON.stringify(action.payload.bookingDetails));
    },
    clearCheckoutDetails: (state) => {
      state.checkoutType = null;
      state.bookingDetails = null;
      localStorage.removeItem('checkoutType');
      localStorage.removeItem('bookingDetails');
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
      state.lastAddedItem = null;
      localStorage.removeItem('cartItems'); // Clear localStorage
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
        localStorage.setItem('cartItems', JSON.stringify(action.payload)); // Sync with localStorage
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
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Sync with localStorage
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        state.items = state.items.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        );
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Sync with localStorage
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
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
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Sync with localStorage
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCartFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartFromServer.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.lastAddedItem = null;
        localStorage.removeItem('cartItems'); // Clear localStorage
      })
      .addCase(clearCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCartError,
  clearLastAddedItem,
  clearCart,
  setCheckoutDetails,
  clearCheckoutDetails,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectLastAddedItem = (state) => state.cart.lastAddedItem;
export const selectCartItemsCount = (state) => state.cart.items.length;
export const selectCheckoutType = (state) => state.cart.checkoutType;
export const selectBookingDetails = (state) => state.cart.bookingDetails;
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;