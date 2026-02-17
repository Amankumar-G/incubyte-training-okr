import apiClient from '../client';

const chatbotService = {
  sendMessage: (message: string) => apiClient.post('/chatbot', { message }),
};

export default chatbotService;
