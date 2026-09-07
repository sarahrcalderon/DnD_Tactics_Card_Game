const GOLD_STORAGE_KEY = 'characterGold';

export const getGold = (): number => {
  const storedGold = Number(localStorage.getItem(GOLD_STORAGE_KEY));
  return Number.isFinite(storedGold) && storedGold >= 0 ? storedGold : 0;
};

export const setGold = (amount: number): number => {
  const nextGold = Math.max(0, Math.floor(amount));
  localStorage.setItem(GOLD_STORAGE_KEY, String(nextGold));
  return nextGold;
};

export const awardBattleGold = (): { total: number; bonus: number } => {
  const bonus = Math.random() < 0.25 ? 250 : 0;
  const total = setGold(getGold() + 100 + bonus);
  return { total, bonus };
};

export const resetGold = (): void => {
  localStorage.removeItem(GOLD_STORAGE_KEY);
};
