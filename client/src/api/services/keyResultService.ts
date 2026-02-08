import apiClient from '../client';
import API_CONFIG from '../config';
import type { keyResult } from '../../types/OkrFormTypes.ts';

export const keyResultService = {
  toggleComplete: (id: string) =>
    apiClient.patch(`${API_CONFIG.ENDPOINTS.KEYRESULT}/${id}/toggle-complete`),

  deleteKeyResult: (id: string) => apiClient.delete(`${API_CONFIG.ENDPOINTS.KEYRESULT}/${id}`),

  updateKeyResult: (keyResultId: string, toUpdateKr: Partial<keyResult>) =>
    apiClient.patch(`${API_CONFIG.ENDPOINTS.KEYRESULT}/${keyResultId}`, toUpdateKr),
};

export default keyResultService;
