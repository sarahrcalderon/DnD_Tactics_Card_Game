import { API_URL } from '../api/client';
import type {
  LobbyCommand,
  MatchSnapshot,
  SocketStatus,
} from '../types/online.types';

interface SocketCallbacks {
  state: (snapshot: MatchSnapshot) => void;
  status: (status: SocketStatus) => void;
  error: (message: string) => void;
  expired: () => void;
}

export class GameSocket {
  private socket: WebSocket | null = null;
  private disposed = false;
  private ready = false;
  private timeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private matchId: string,
    private token: string,
    private callbacks: SocketCallbacks
  ) {}

  connect() {
    const url = new URL(API_URL, window.location.origin);

    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = `${url.pathname.replace(/\/$/, '')}/ws/matches/${encodeURIComponent(
      this.matchId
    )}`;
    url.search = '';
    url.hash = '';

    this.callbacks.status('connecting');

    const socket = new WebSocket(url);
    this.socket = socket;

    this.timeout = setTimeout(() => {
      if (this.disposed || this.ready) return;

      this.callbacks.error(
        'Não foi possível estabelecer a conexão com a partida. Tente reconectar.'
      );
      this.callbacks.status('disconnected');
      socket.close();
    }, 15000);

    socket.onopen = () => {
      if (!this.disposed) {
        socket.send(
          JSON.stringify({ type: 'authenticate', token: this.token })
        );
      }
    };

    socket.onmessage = event => {
      if (this.disposed) return;

      try {
        const message = JSON.parse(event.data) as {
          type?: string;
          code?: string;
          message?: string;
          data?: MatchSnapshot;
        };

        if (message.type === 'error') {
          this.callbacks.error(
            message.message || 'Não foi possível concluir a ação.'
          );
          if (message.code === 'authentication_required') {
            this.callbacks.expired();
          }
          if (message.code === 'match_access_denied') {
            this.callbacks.status('denied');
          }
          return;
        }

        if (
          message.data?.match?.id === this.matchId &&
          Array.isArray(message.data.players)
        ) {
          clearTimeout(this.timeout);
          this.ready = true;
          this.callbacks.status('connected');
          this.callbacks.state(message.data);
        }
      } catch {
        this.callbacks.error('O servidor enviou uma mensagem inválida.');
      }
    };

    socket.onerror = () => {
      if (!this.disposed) {
        this.callbacks.error('A conexão com a partida foi interrompida.');
      }
    };

    socket.onclose = event => {
      clearTimeout(this.timeout);
      this.ready = false;

      if (this.disposed) return;

      if (event.code === 4401) this.callbacks.expired();
      this.callbacks.status(event.code === 4403 ? 'denied' : 'disconnected');
    };
  }

  send(command: LobbyCommand) {
    if (!this.ready || this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('Conecte-se à partida antes de continuar.');
    }

    this.socket.send(JSON.stringify(command));
  }

  close() {
    clearTimeout(this.timeout);
    this.disposed = true;
    this.ready = false;

    if (this.socket?.readyState === WebSocket.CONNECTING) {
      this.socket.onopen = () => this.socket?.close();
    } else {
      this.socket?.close();
    }
  }
}