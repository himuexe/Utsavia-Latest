
const ChatMessage = require('../models/chatmessage');
const User = require('../models/user');

// Simple NLP function to detect intent
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
    return 'booking';
  }
  if (lowerMessage.includes('pay') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'payment';
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return 'contact';
  }
  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
    return 'cancel';
  }
  if (lowerMessage.includes('city') || lowerMessage.includes('location')) {
    return 'cities';
  }
  if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
    return 'login';
  }
  if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
    return 'register';
  }
  if (lowerMessage.includes('theme') || lowerMessage.includes('activity')) {
    return 'themes';
  }
  
  return 'general';
};

// Generate response based on intent
const generateResponse = (intent, isLoggedIn, userData = null) => {
  const responses = {
    booking: 'To make a booking, please select a city and theme, then click on "Book Now". Would you like me to help you find something specific?',
    payment: 'We accept all major credit cards, PayPal, and digital wallets. Your payment information is securely processed. Do you have any specific payment questions?',
    contact: 'You can reach our support team through the Contact page or email at support@yourwebsite.com. Is there something specific you need help with?',
    cancel: 'You can cancel your booking through the "My Bookings" section in your profile up to 24 hours before your scheduled time. Would you like to know more about our cancellation policy?',
    cities: 'We currently operate in multiple cities. You can use the city selector to choose your preferred location. Which city are you interested in?',
    login: 'You can log in using your email and password. If you forgot your password, use the "Forgot Password" option. Would you like me to direct you to the login page?',
    register: 'To create an account, go to the Register page and fill out the form with your details. Would you like me to direct you to the registration page?',
    themes: 'We offer various exciting themes for different interests and age groups. You can browse them on our home page or through the categories navigation. Are you looking for something specific?',
    general: "I'm here to help with bookings, account information, and general inquiries. What can I assist you with today?"
  };
  
  // Personalize response if user is logged in
  if (isLoggedIn && userData) {
    if (intent === 'booking') {
      return `Hello ${userData.firstName}! ${responses.booking}`;
    }
    if (intent === 'cancel' && userData.bookings && userData.bookings.length > 0) {
      return `I see you have ${userData.bookings.length} active booking(s). ${responses.cancel}`;
    }
  }
  
  return responses[intent] || responses.general;
};

// Handle incoming messages
exports.handleMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Get user data if logged in
    let userData = null;
    let isLoggedIn = false;
    
    if (userId) {
      userData = await User.findById(userId).select('firstName lastName email bookings');
      isLoggedIn = !!userData;
    }
    
    // Detect intent from message
    const intent = detectIntent(message);
    
    // Generate response
    const responseText = generateResponse(intent, isLoggedIn, userData);
    
    // Save conversation to database if user is logged in
    let savedMessage = null;
    if (userId) {
      savedMessage = await ChatMessage.create({
        userId,
        userMessage: message,
        botResponse: responseText,
        intent,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: responseText,
      intent,
      messageId: savedMessage ? savedMessage._id : null
    });
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again later.'
    });
  }
};

// Get user's chat history
exports.getHistory = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user._id;
    
    const history = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20);  // Get last 20 messages
    
    res.status(200).json({
      success: true,
      history: history.reverse()  // Reverse to get chronological order
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
      res.status(500).json({
      success: false,
      message: 'Error retrieving chat history',
      history: []
    });
  }
};

// Clear user's chat history
exports.clearHistory = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user._id;
    
    await ChatMessage.deleteMany({ userId });
    
    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history'
    });
  }
};

// Save feedback for a message
exports.saveFeedback = async (req, res) => {
  try {
    const { messageId, rating } = req.body;
    
    if (!messageId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Message ID and rating are required'
      });
    }
    
    const message = await ChatMessage.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Ensure the user owns this message
    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to provide feedback for this message'
      });
    }
    
    message.feedback = rating;
    await message.save();
    
    res.status(200).json({
      success: true,
      message: 'Feedback saved successfully'
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving feedback'
    });
  }
};

// Get suggestions based on user query (for quick replies)
exports.getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }
    
    // Simple suggestion logic based on keywords
    const suggestions = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('book')) {
      suggestions.push('How do I make a booking?');
      suggestions.push('What are the available booking times?');
    }
    
    if (lowerQuery.includes('pay')) {
      suggestions.push('What payment methods do you accept?');
      suggestions.push('Is there a cancellation fee?');
    }
    
    if (lowerQuery.includes('theme')) {
      suggestions.push('What themes do you offer?');
      suggestions.push('What is your most popular theme?');
    }
    
    // If no specific suggestions, provide general ones
    if (suggestions.length === 0) {
      suggestions.push('How do I book an activity?');
      suggestions.push('What payment methods do you accept?');
      suggestions.push('How can I view my bookings?');
    }
    
    res.status(200).json({
      success: true,
      suggestions: suggestions.slice(0, 3) // Return max 3 suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      suggestions: []
    });
  }
};

// Get admin statistics (only for admin users)
exports.getStats = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    
    // Get total message count
    const totalMessages = await ChatMessage.countDocuments();
    
    // Get messages from last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentMessages = await ChatMessage.countDocuments({
      timestamp: { $gte: lastWeek }
    });
    
    // Get most common intents
    const intents = await ChatMessage.aggregate([
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get average feedback score (1 = positive, 0 = negative)
    const feedbackStats = await ChatMessage.aggregate([
      { $match: { feedback: { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$feedback' }, count: { $sum: 1 } } }
    ]);
    
    const avgFeedback = feedbackStats.length > 0 ? feedbackStats[0].avgScore : null;
    const feedbackCount = feedbackStats.length > 0 ? feedbackStats[0].count : 0;
    
    res.status(200).json({
      success: true,
      stats: {
        totalMessages,
        recentMessages,
        topIntents: intents.map(i => ({ intent: i._id, count: i.count })),
        feedback: {
          average: avgFeedback,
          count: feedbackCount,
          positivePercentage: avgFeedback !== null ? Math.round(avgFeedback * 100) : null
        }
      }
    });
  } catch (error) {
    console.error('Error getting chat statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat statistics',
      stats: {}
    });
  }
};