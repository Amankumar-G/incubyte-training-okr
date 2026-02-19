const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    OBJECTIVE: '/objectives',
    KEYRESULT: '/key-results',
    CHATBOT: '/chatbot',
  },
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
