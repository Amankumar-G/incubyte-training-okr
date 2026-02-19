import apiClient from '../client';
import API_CONFIG from '../config';

const chatbotService = {
  sendMessage: (message: string) => apiClient.post(API_CONFIG.ENDPOINTS.CHATBOT, { message }),
  resetChat: () => apiClient.get(`${API_CONFIG.ENDPOINTS.CHATBOT}/reset`),
  streamMessage: (message: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHATBOT}/stream?message=${encodeURIComponent(message)}`,
};

export default chatbotService;
