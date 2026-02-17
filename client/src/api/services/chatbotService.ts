import apiClient from '../client';

const chatbotService = {
  sendMessage: (message: string) => apiClient.post('/chatbot', { message }),
  resetChat: () => apiClient.get('/chatbot/reset'),
};

export default chatbotService;
