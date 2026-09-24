import { apiClient } from '../api/client';
import type { Authentication, OnlineUser } from '../types/online.types';

export const authService = {
  async login(email: string, password: string) {
    return (
      await apiClient.post<Authentication>('/auth/login', { email, password })
    ).data;
  },

  async register(username: string, email: string, password: string) {
    return (
      await apiClient.post<Authentication>('/auth/register', {
        username,
        email,
        password,
      })
    ).data;
  },

  async me(signal?: AbortSignal) {
    return (await apiClient.get<OnlineUser>('/auth/me', { signal })).data;
  },
  async requestPasswordReset(email: string) {
    await apiClient.post('/auth/password-reset', { email });
  },
  async confirmPasswordReset(token: string, password: string) {
    await apiClient.post('/auth/password-reset/confirm', { token, password });
  },
};
