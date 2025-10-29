const aiService = require('../services/aiService');
const { ChatHistory, Debt } = require('../models');

// Get AI-generated advice
exports.getAdvice = async (req, res) => {
  try {
    const advice = await aiService.getAIAdvice(req.userId, req.body);
    
    res.json({ 
      advice,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get advice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Chat with AI coach
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user's debts for context
    const debts = await Debt.findAll({
      where: { userId: req.userId, status: 'Active' }
    });

    // Generate AI response with context
    const response = await aiService.generateChatResponse(message, debts, req.userId);

    // Save to chat history
    await ChatHistory.create({
      userId: req.userId,
      message,
      response,
      timestamp: new Date()
    });

    res.json({ 
      message,
      response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findAll({
      where: { userId: req.userId },
      order: [['timestamp', 'DESC']],
      limit: 50
    });

    res.json(history.reverse()); // Return oldest first
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
