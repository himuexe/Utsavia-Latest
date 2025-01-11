const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getSubCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/api/category/subcategories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      const errorBody = await response.json();
  
      throw new Error(errorBody.message || "Error Fetching Categories");
    }
  
    return response.json();
  };

  export const getItems = async (categoryId, location) => {    
    const response = await fetch(`${API_BASE_URL}/api/category/items/${categoryId}/${location}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    return response.json();
  };

  export const getItem = async (categoryId, location) => {    
    const response = await fetch(`${API_BASE_URL}/api/category/item/${categoryId}/${location}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    return response.json();
  };