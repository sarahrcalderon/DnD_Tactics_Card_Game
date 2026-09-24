const key = 'dnd.online.token';
const listeners = new Set<() => void>();
let token = sessionStorage.getItem(key);

export const authSession = {
  get: () => token,

  set(value: string | null) {
    token = value;

    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);

    listeners.forEach(listener => listener());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};