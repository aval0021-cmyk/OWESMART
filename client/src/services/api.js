import axios from 'axios';

// Determine API base URL dynamically
const getApiBaseUrl = () => {
  // Allow explicit override via env var (for production deployment)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In development, use localhost backend
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }

  // Fallback to localhost
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const googleAuth = (googleUserData) => api.post('/auth/google', googleUserData);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getDashboardOverview = () => api.get('/dashboard/overview');

// Debts
export const getDebts = () => api.get('/debts');
export const getDebt = (id) => api.get(`/debts/${id}`);
export const createDebt = (debtData) => api.post('/debts', debtData);
export const updateDebt = (id, debtData) => api.put(`/debts/${id}`, debtData);
export const deleteDebt = (id) => api.delete(`/debts/${id}`);

// Consolidation
export const calculateStrategies = (data) => api.post('/consolidation/calculate', data);
export const getSuggestedStrategy = () => api.get('/consolidation/suggestion');

// Payments
export const createPayment = (paymentData) => api.post('/payments', paymentData);
export const getPayments = () => api.get('/payments');
export const getPaymentsByDebt = (debtId) => api.get(`/payments/debt/${debtId}`);

// AI
export const getAIAdvice = (context) => api.post('/ai/advice', context);

export default api;
