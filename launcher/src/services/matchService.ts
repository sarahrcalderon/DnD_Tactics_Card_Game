import { apiClient } from '../api/client';
import type {
  LoadoutSelection,
  MatchSnapshot,
  MatchSide,
  OnlineMatch,
} from '../types/online.types';

export const matchService = {
  async create(side: MatchSide, selection: LoadoutSelection) {
    return (
      await apiClient.post<OnlineMatch>('/matches', { side, ...selection })
    ).data;
  },

  async lobby(id: string, signal?: AbortSignal) {
    return (
      await apiClient.get<MatchSnapshot>(`/matches/${id}/lobby`, { signal })
    ).data;
  },

  remember(userId: string, matchId: string) {
    localStorage.setItem(`dnd.online.match.${userId}`, matchId);
  },

  last(userId: string) {
    return localStorage.getItem(`dnd.online.match.${userId}`);
  },
};