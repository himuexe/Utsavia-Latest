
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Send message to backend for processing
export const sendChatMessage = async (message, userId = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, userId }),
    });
    
    if (!response.ok) throw new Error("Failed to send message to chatbot");
    return response.json();
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again later.'
    };
  }
};

// Get conversation history
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/history`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) throw new Error("Failed to fetch chat history");
    return response.json();
  } catch (error) {
    console.error('Error getting chatbot history:', error);
    return {
      success: false,
      history: []
    };
  }
};

// Rate a chatbot response
export const rateChatResponse = async (messageId, rating) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messageId, rating }),
    });
    
    if (!response.ok) throw new Error("Failed to save feedback");
    return response.json();
  } catch (error) {
    console.error('Error sending feedback:', error);
    return {
      success: false
    };
  }
};

// Clear chat history
export const clearChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/history`, {
      method: "DELETE",
      credentials: "include",
    });
    
    if (!response.ok) throw new Error("Failed to clear chat history");
    return response.json();
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return {
      success: false
    };
  }
};

// Get suggested responses based on user query
export const getSuggestedResponses = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/suggestions?query=${encodeURIComponent(query)}`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) throw new Error("Failed to fetch suggestions");
    return response.json();
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return {
      success: false,
      suggestions: []
    };
  }
};

// Get chat statistics (for admin)
export const getChatStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/stats`, {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) throw new Error("Failed to fetch chat statistics");
    return response.json();
  } catch (error) {
    console.error('Error getting chat statistics:', error);
    return {
      success: false,
      stats: {}
    };
  }
};