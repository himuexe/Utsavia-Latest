
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatBotController');
const verifyToken = require('../middleware/verifytoken');

// Public route - can be accessed without authentication
router.post('/message', chatbotController.handleMessage);
router.get('/suggestions', chatbotController.getSuggestions);

// ed routes - require authentication
router.get('/history',verifyToken , chatbotController.getHistory);
router.delete('/history',verifyToken , chatbotController.clearHistory);
router.post('/feedback',verifyToken , chatbotController.saveFeedback);
router.get('/stats',verifyToken , chatbotController.getStats);

module.exports = router;
