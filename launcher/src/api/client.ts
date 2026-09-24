import axios from 'axios';
import { authSession } from '../services/authSession';


export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = authSession.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login' && error.config?.url !== '/auth/register'
        && error.config?.headers?.Authorization === `Bearer ${authSession.get()}`) {
      authSession.set(null);
    }
    return Promise.reject(error);
  }
);

export const api = {
  startGame: () => apiClient.post('/api/launcher/start'),
  getStatus: () => apiClient.get('/api/launcher/status'),
  saveGame: () => apiClient.post('/api/launcher/save'),
  loadGame: () => apiClient.get('/api/launcher/load'),
};
