export type MatchSide = 'ENEMY' | 'CHAMPION';
export type MatchStatus =
  | 'WAITING'
  | 'READY'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELLED';

export interface OnlineUser {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  online?: boolean;
  character_name?: string | null;
  character_class?: string | null;
  character_level?: number | null;
  portrait_url?: string | null;
}

export interface Authentication {
  access_token: string;
  token_type: string;
  user: OnlineUser;
}

export interface FriendRequest {
  id: string;
  sender: OnlineUser;
  status: string;
  created_at: string;
}

export interface GameInvite {
  id: string;
  match_id: string;
  sender_id: string;
  sender_name: string | null;
  side: MatchSide;
  status: string;
  expires_at: string;
}

export interface OnlineCharacter {
  id: string;
  name: string;
  character: {
    class_id: string;
    race_id: string;
    hp: number;
    max_hp: number;
    mana: number;
    portrait_url?: string | null;
    level: number;
  };
}

export interface OnlineDeck {
  id: string;
  name: string;
  side: MatchSide;
  class_id: string | null;
  card_ids: string[];
}

export interface CatalogCard {
  id: string;
  name: string;
  type: string;
  class_id: string;
  build: string;
  cost: number;
  attack?: number;
  defense?: number;
}

export interface CatalogClass {
  id: string;
  name: string;
}

export interface CatalogRace {
  id: string;
  name: string;
  images: Record<string, string[]>;
}

export interface LoadoutSelection {
  character_id: string | null;
  deck_id: string;
}

export interface OnlineMatch {
  id: string;
  status: MatchStatus;
  started_at?: string | null;
  finished_at?: string | null;
  winner_side?: 'ENEMY' | 'CHAMPIONS' | null;
}

export interface LobbyPlayer {
  user_id: string;
  username?: string | null;
  avatar_url?: string | null;
  character_name?: string | null;
  class_id?: string | null;
  race_id?: string | null;
  character_id: string | null;
  deck_id?: string | null;
  side: MatchSide;
  slot: number;
  ready: boolean;
  connected: boolean;
}

export interface BattleSummary {
  is_active: boolean;
  turn: { number: number; user_id: string; side: MatchSide };
  players: {
    user_id: string;
    hp: number;
    max_hp: number;
    action_points: number;
  }[];
}

export interface MatchSnapshot {
  match: OnlineMatch;
  players: LobbyPlayer[];
  battle?: BattleSummary | null;
}

export type SocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'denied';

export type LobbyCommand =
  | { type: 'set_ready'; ready: boolean }
  | { type: 'start_match' }
  | { type: 'get_state' };

export const sideLabel = (side: MatchSide) =>
  side === 'ENEMY' ? 'Inimigo' : 'Campeão';

export const matchLabel = (id: string) =>
  `Expedição ${id.slice(0, 8).toUpperCase()}`;
