import { apiClient } from '../api/client';
import type {
  GameInvite,
  LoadoutSelection,
  MatchSide,
} from '../types/online.types';

export const gameInviteService = {
  async list(signal?: AbortSignal) {
    return (
      await apiClient.get<GameInvite[]>('/matches/invites', { signal })
    ).data;
  },

  async send(matchId: string, receiverId: string, side: MatchSide) {
    return (
      await apiClient.post<GameInvite>(`/matches/${matchId}/invite`, {
        receiver_id: receiverId,
        side,
      })
    ).data;
  },

  async accept(id: string, selection: LoadoutSelection) {
    return (
      await apiClient.post<{ match_id: string }>(
        `/matches/invites/${id}/accept`,
        selection,
      )
    ).data;
  },

  async reject(id: string) {
    await apiClient.post(`/matches/invites/${id}/reject`);
  },
};