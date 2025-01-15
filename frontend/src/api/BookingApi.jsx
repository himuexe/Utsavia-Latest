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