const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("API Error Response:", error); // Log the error response
      throw new Error(error.message || 'Failed to create payment intent');
    }
    return response.json();
  } catch (error) {
    console.error("Fetch Error:", error); // Log any fetch-related errors
    throw error;
  }
};
