import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GameSocket } from '../services/gameSocket';
import { authSession } from '../services/authSession';
import { matchService } from '../services/matchService';
import type {
  LobbyCommand,
  MatchSnapshot,
  SocketStatus,
} from '../types/online.types';
import { apiError } from '../utils/apiError';

export function useLobby(matchId: string) {
  const { token, user } = useAuth();
  const [snapshot, setSnapshot] = useState<MatchSnapshot | null>(null);
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const socket = useRef<GameSocket | null>(null);
  const waiting = useRef<LobbyCommand | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const clearPending = useCallback(() => {
    waiting.current = null;
    clearTimeout(timer.current);
    setPending(false);
  }, []);

  useEffect(() => {
    if (!token || !user || !matchId) return;

    setSnapshot(null);
    setError('');
    clearPending();

    const connection = new GameSocket(matchId, token, {
      state: value => {
        setSnapshot(value);
        matchService.remember(user.id, matchId);

        const own = value.players.find(player => player.user_id === user.id);
        const command = waiting.current;

        if (
          (command?.type === 'set_ready' &&
            own?.ready === command.ready) ||
          (command?.type === 'start_match' &&
            value.match.status !== 'WAITING') ||
          command?.type === 'get_state'
        ) {
          clearPending();
        }
      },
      status: value => {
        setStatus(value);
        if (value !== 'connected') clearPending();
      },
      error: message => {
        setError(message);
        clearPending();
      },
      expired: () => authSession.set(null),
    });

    socket.current = connection;

    try {
      connection.connect();
    } catch (failure) {
      setError(apiError(failure));
      setStatus('disconnected');
    }

    return () => {
      connection.close();
      clearTimeout(timer.current);
      socket.current = null;
    };
  }, [matchId, token, user?.id, attempt, clearPending]);

  const send = (command: LobbyCommand) => {
    if (waiting.current) return;

    setError('');

    try {
      if (!socket.current) {
        throw new Error('A conexão com a partida está indisponível.');
      }

      waiting.current = command;
      setPending(true);
      socket.current.send(command);

      timer.current = setTimeout(() => {
        clearPending();
        setError(
          'A confirmação demorou mais que o esperado. Reconecte para atualizar a partida.'
        );
      }, 12000);
    } catch (failure) {
      clearPending();
      setError(apiError(failure));
    }
  };

  return {
    snapshot,
    status,
    error,
    pending,
    send,
    reconnect: () => setAttempt(value => value + 1),
  };
}