// utils/safeUtils.ts
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

export const safeToFixed = (value: any, decimals: number = 1): string => {
  const num = safeNumber(value, 0);
  return num.toFixed(decimals);
};

export const safePercentage = (value: any, decimals: number = 1): string => {
  return `${safeToFixed(value, decimals)}%`;
};