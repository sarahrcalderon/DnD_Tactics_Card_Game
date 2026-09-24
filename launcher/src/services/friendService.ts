import { apiClient } from '../api/client';
import type { FriendRequest, OnlineUser } from '../types/online.types';

export const friendService = {
  async list(signal?: AbortSignal) {
    return (await apiClient.get<OnlineUser[]>('/friends', { signal })).data;
  },

  async requests(signal?: AbortSignal) {
    return (
      await apiClient.get<FriendRequest[]>('/friends/requests', { signal })
    ).data;
  },

  async send(email: string) {
    await apiClient.post('/friends/requests', { receiver_email: email });
  },

  async respond(id: string, response: 'accept' | 'reject') {
    await apiClient.post(`/friends/requests/${id}/${response}`);
  },

  async remove(id: string) {
    await apiClient.delete(`/friends/${id}`);
  },
};