// frontend/src/api/client.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================
// ENDPOINTS
// ============================================================

export const api = {
  // Classes
  getClasses: () => apiClient.get('/api/classes'),
  getClass: (id: string) => apiClient.get(`/api/classes/${id}`),

  // Raças
  getRaces: () => apiClient.get('/api/races'),
  getRacesByClass: (classId: string) => apiClient.get(`/api/races/${classId}`),
  getRaceDetail: (classId: string, raceId: string) =>
    apiClient.get(`/api/races/${classId}/${raceId}`),

  // Personagem
  getCharacter: () => apiClient.get('/api/character'),
  createCharacter: (data: any) => apiClient.post('/api/character', data),
  updateCharacter: (data: any) => apiClient.put('/api/character', data),
  deleteCharacter: () => apiClient.delete('/api/character'),

  // Batalha
  startBattle: () => apiClient.post('/api/battle/start'),
  battleAction: (action: string, cardIndex?: number, target?: string) =>
    apiClient.post('/api/battle/action', { action, card_index: cardIndex, target }),
  getBattleState: () => apiClient.get('/api/battle/state'),
  endBattle: () => apiClient.post('/api/battle/end'),
};