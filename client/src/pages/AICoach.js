import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AICoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/ai/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const formattedHistory = response.data.flatMap(chat => [
        { type: 'user', content: chat.message, timestamp: chat.timestamp },
        { type: 'ai', content: chat.response, timestamp: chat.timestamp }
      ]);
      
      setMessages(formattedHistory);
    } catch (error) {
      console.error('Load chat history error:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/chat',
        { message: inputMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = {
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'I apologize, but I encountered a technical issue due to constrained resources. 😔\n\nThis could be a temporary server issue. Please try:\n• Rephrasing your question\n• Asking something simpler\n• Trying again in a moment\n\nI\'m here to help with debt management and financial planning!',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "How should I pay off my debts?",
    "What's the avalanche method?",
    "Help me create a budget",
    "How can I save money?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-white text-xl font-bold">AI Debt Coach</h1>
            <p className="text-blue-100 text-sm">Ask me anything about debt management</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-blue-50 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </div>

      {/* Messages Container - with bottom padding to prevent blocking */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-white text-lg font-semibold mb-2">Start a conversation</h3>
            <p className="text-slate-400 mb-6">Ask me about debt strategies, budgeting, or financial advice</p>
            
            {/* Quick Questions */}
            <div className="max-w-md mx-auto space-y-2">
              <p className="text-slate-500 text-sm mb-3">Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl text-left transition border border-slate-700 hover:border-blue-500"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm mr-2">AI is thinking</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Fixed at bottom with max-width */}
      <div className="sticky bottom-0 z-40 bg-slate-800 border-t border-slate-700 px-6 py-4 shadow-lg">
        <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 border border-slate-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;
