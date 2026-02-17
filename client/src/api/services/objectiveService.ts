import apiClient from '../client';
import API_CONFIG from '../config';

interface OkrDtoType {
  title: string;
  keyResults: { description: string; progress: number }[];
}

export const objectiveService = {
  getAllOkrs: () => apiClient.get(API_CONFIG.ENDPOINTS.OBJECTIVE),

  deleteOkr: (okrId: string) => apiClient.delete(`${API_CONFIG.ENDPOINTS.OBJECTIVE}/${okrId}`),

  updateOkr: (id: string, okrData: OkrDtoType) =>
    apiClient.put(`${API_CONFIG.ENDPOINTS.OBJECTIVE}/${id}`, okrData),

  createOkr: (okrData: OkrDtoType) => apiClient.post(API_CONFIG.ENDPOINTS.OBJECTIVE, okrData),

  suggestOkr: (query: string) => apiClient.post(`${API_CONFIG.ENDPOINTS.OBJECTIVE}/ai`, { query }),
};

export default objectiveService;
