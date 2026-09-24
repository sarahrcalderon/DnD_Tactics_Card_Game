import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import { authSession } from '../services/authSession';
import type { OnlineUser } from '../types/online.types';
import { apiError } from '../utils/apiError';

interface AuthState {
  user: OnlineUser | null;
  token: string | null;
  loading: boolean;
  error: string;
  retry: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  uploadAvatar: (image: File) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(authSession.get);
  const [user, setUser] = useState<OnlineUser | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(
    () =>
      authSession.subscribe(() => {
        setToken(authSession.get());
        if (!authSession.get()) setUser(null);
      }),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    setError('');

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    authService
      .me(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setUser(result);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(apiError(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [token, attempt]);

  useEffect(() => {
    if (!token) return;
    const sendHeartbeat = () => void authService.heartbeat().catch(() => undefined);
    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 30_000);
    return () => window.clearInterval(interval);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);

    setUser(result.user);
    authSession.set(result.access_token);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authService.register(name, email, password);

      setUser(result.user);
      authSession.set(result.access_token);
    },
    [],
  );

  const uploadAvatar = useCallback(async (image: File) => {
    const updated = await authService.uploadAvatar(image);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        uploadAvatar,
        retry: () => setAttempt((value) => value + 1),
        logout: () => authSession.set(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('AuthProvider ausente.');

  return context;
}
