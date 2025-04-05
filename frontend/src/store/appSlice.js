import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: undefined,
  chatbot: {
    isOpen: false,
    messages: [
      { text: "Hello! How can I help you today?", sender: 'bot' }
    ],
    unreadCount: 0
  },
  isLoading: true,
  isLoggedIn: true,
  isAddressValid: false,
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
    setAddressValidity: (state, action) => {
      state.isAddressValid = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedCity', action.payload);
      } else {
        localStorage.removeItem('selectedCity');
      }
    },
    toggleChatbot: (state) => {
      state.chatbot.isOpen = !state.chatbot.isOpen;
      if (state.chatbot.isOpen) {
        state.chatbot.unreadCount = 0;
      }
    },
    addChatMessage: (state, action) => {
      state.chatbot.messages.push(action.payload);
      if (!state.chatbot.isOpen && action.payload.sender === 'bot') {
        state.chatbot.unreadCount += 1;
      }
    },
    clearChatMessages: (state) => {
      state.chatbot.messages = [
        { text: "Hello! How can I help you today?", sender: 'bot' }
      ];
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  showToast,
  clearToast,
  setLoading,
  setLoggedIn,
  setAddressValidity,
  setSelectedCity,
  toggleChatbot, 
  addChatMessage, 
  clearChatMessages 
} = appSlice.actions;

// Selectors
export const selectToast = (state) => state.app.toast;
export const selectIsLoading = (state) => state.app.isLoading;
export const selectIsLoggedIn = (state) => state.app.isLoggedIn;
export const selectSelectedCity = (state) => state.app.selectedCity;
export const selectIsAddressValid = (state) => state.app.isAddressValid; 
export const selectChatbotState = (state) => state.app.chatbot;
export const selectChatbotIsOpen = (state) => state.app.chatbot.isOpen;
export const selectChatbotMessages = (state) => state.app.chatbot.messages;
export const selectChatbotUnreadCount = (state) => state.app.chatbot.unreadCount;
