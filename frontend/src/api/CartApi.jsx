const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const addToCart = async (itemDetails) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemDetails)
    });
    
    if (!response.ok) {
        throw new Error("Failed to add item to cart");
    }
    return response.json();
};

export const getCartItems = async () => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch cart items");
    }
    return response.json();
};

export const removeFromCart = async (cartItemId) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    if (!response.ok) {
        throw new Error("Failed to remove item from cart");
    }
    return response.json();
};