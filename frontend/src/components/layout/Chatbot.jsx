import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn} from '../../store/appSlice';
import { sendChatMessage, getChatHistory } from '../../api/ChatBotApi';
import { fetchCurrentUser } from '../../api/MyUserApi';
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Local fallback responses for offline capability
  const botResponses = {
    'hello': 'Hi there! How can I assist you today?',
    'hi': 'Hello! How can I help you?',
    'booking': 'To make a booking, please select a city and theme, then click on "Book Now".',
    'payment': 'We accept all major credit cards, PayPal, and digital wallets for payments.',
    'contact': 'You can reach our support team through the Contact page or email at support@yourwebsite.com.',
    'refund': 'For refund inquiries, please contact our customer service within 24 hours of your booking.',
    'cancel': 'You can cancel your booking through the "My Bookings" section in your profile.',
    'cities': 'We currently operate in multiple cities. Please use the city selector to choose your preferred location.',
    'login': 'You can log in using your email and password. If you forgot your password, use the "Forgot Password" option.',
    'register': 'To create an account, go to the Register page and fill out the form with your details.',
    'themes': 'Browse our exciting themes on the home page or through the categories navigation.',
    'hours': 'Our customer service is available from 9 AM to 6 PM, Monday through Saturday.',
  };

  // Fallback function for when API is unavailable
  const getLocalBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    // Check if the user is asking about their bookings
    if (lowerText.includes('my booking') || lowerText.includes('my reservation')) {
      if (isLoggedIn) {
        return 'You can view all your bookings in the "My Bookings" section. Would you like me to direct you there?';
      } else {
        return 'Please log in to view your bookings. Would you like to go to the login page?';
      }
    }
    
    // Check if user is asking about their profile
    if (lowerText.includes('profile') || lowerText.includes('account')) {
      if (isLoggedIn) {
        return `You can update your profile information in the Profile section. Would you like to go there now?`;
      } else {
        return 'Please log in to access your profile. Would you like to go to the login page?';
      }
    }
    
    // Check for keyword matches
    for (const keyword in botResponses) {
      if (lowerText.includes(keyword)) {
        return botResponses[keyword];
      }
    }
    
    // Default response if no match is found
    return "I'm not sure I understand. Would you like to know about our themes, booking process, or contact information?";
  };
  useEffect(() => {
    const fetchUserId = async () => {
      if (isLoggedIn) {
        try {
          const user = await fetchCurrentUser();
          setCurrentUserId(user._id); // Assuming your user object has _id
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setCurrentUserId(null);
        }
      } else {
        setCurrentUserId(null);
      }
    };

    fetchUserId();
  }, [isLoggedIn]);
  // Load chat history when user opens the chat
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isOpen && isLoggedIn) {
        setIsLoading(true);
        try {
          const result = await getChatHistory();
          if (result.success && result.history && result.history.length > 0) {
            // Transform API response to our message format
            const formattedHistory = result.history.flatMap(item => [
              { text: item.userMessage, sender: 'user' },
              { text: item.botResponse, sender: 'bot' }
            ]);
            setMessages([
              { text: "Hello! How can I help you today?", sender: 'bot' },
              ...formattedHistory
            ]);
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadChatHistory();
  }, [isOpen, isLoggedIn]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Try to get response from API
      const result = await sendChatMessage(
        userMessage.text, 
        isLoggedIn ? currentUserId : null
      );
      
      
      if (result.success) {
        // Use API response
        const botMessage = { 
          text: result.message, 
          sender: 'bot',
          messageId: result.messageId // Store messageId for rating
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to local response
        const fallbackResponse = getLocalBotResponse(userMessage.text);
        const botMessage = { 
          text: fallbackResponse, 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error getting bot response:', error);
      // Use fallback response on error
      const fallbackResponse = getLocalBotResponse(userMessage.text);
      const botMessage = { 
        text: fallbackResponse, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating chat button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Chat dialog */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-medium">Customer Support</h3>
            <p className="text-sm text-blue-100">We're here to help!</p>
          </div>
          
          {/* Messages container */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div 
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-left mb-3">
                    <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                disabled={isTyping || isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || isLoading || inputText.trim() === ''}
                className={`px-4 rounded-r-lg text-white ${
                  isTyping || isLoading || inputText.trim() === '' 
                    ? 'bg-blue-400' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;