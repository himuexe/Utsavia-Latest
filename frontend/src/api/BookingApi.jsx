const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const validatePincode = async (pincode) => {
    const response = await fetch(`${API_BASE_URL}/api/booking/pincode/${pincode}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch location");
    }
    return response.json();
}
export const createPaymentIntent = async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/api/booking/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(paymentData)
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }
  
    return response.json();
  };
  
  export const updateBookingStatus = async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/api/booking/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bookingData)
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update booking status');
    }
  
    return response.json();
  };