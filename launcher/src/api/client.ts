// launcher/src/api/client.ts
import axios from 'axios';

// Usando import.meta.env com tipagem correta
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para logs
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    return Promise.reject(error);
  }
);

export const api = {
  startGame: () => apiClient.post('/api/launcher/start'),
  getStatus: () => apiClient.get('/api/launcher/status'),
  saveGame: () => apiClient.post('/api/launcher/save'),
  loadGame: () => apiClient.get('/api/launcher/load'),
};