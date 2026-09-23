export type StatValueFormat = 'integer' | 'decimal' | 'percentage' | 'distance';

export const formatStatValue = (
  value: number | undefined | null,
  format: StatValueFormat = 'integer',
): string => {
  const safeValue = Number.isFinite(value) ? Number(value) : 0;
  const decimals = format === 'integer' ? 0 : 1;
  const rounded = Number(safeValue.toFixed(decimals));
  const suffix = format === 'percentage' ? '%' : format === 'distance' ? 'm' : '';

  return `${rounded}${suffix}`;
};

export const formatStatBonus = (
  value: number | undefined | null,
  format: StatValueFormat = 'integer',
): string | null => {
  const safeValue = Number.isFinite(value) ? Number(value) : 0;
  if (safeValue === 0) return null;

  const formatted = formatStatValue(Math.abs(safeValue), format);
  return `${safeValue > 0 ? '+' : '-'}${formatted}`;
};
