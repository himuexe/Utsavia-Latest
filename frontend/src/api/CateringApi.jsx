

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

export const getCateringItem = async (id, city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/items/${id}?city=${city}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch catering item');
  }
};

export const getMenuItems = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/menu?category=${category}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch menu items');
  }
};

export const validateAvailability = async (date, guestCount, city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/check-availability`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        guestCount,
        city,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to validate availability');
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/bookings`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to create booking');
  }
};

export const getUserBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/my-bookings`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user bookings');
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/bookings/${bookingId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch booking details');
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catering/bookings/${bookingId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to update booking status');
  }
};