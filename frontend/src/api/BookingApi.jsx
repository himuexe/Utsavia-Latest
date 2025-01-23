const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/api/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error("Failed to create booking");
  return response.json();
};

// Get all bookings for a user
export const getUserBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/booking/user`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

// Get a single booking by ID
export const getBookingById = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch booking");
  return response.json();
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/booking/${bookingId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update booking status");
  return response.json();
};