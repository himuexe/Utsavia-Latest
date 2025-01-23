const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const getUserBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/booking/user`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};