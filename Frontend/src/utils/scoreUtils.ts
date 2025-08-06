// utils/scoreUtils.ts
export const calculatePercentage = (score: number, totalScore: number): number => {
  if (totalScore === 0) return 0;
  return Math.round((score / totalScore) * 100);
};

export const getScoreGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-100';
  if (percentage >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const getScoreEmoji = (percentage: number): string => {
  if (percentage >= 90) return '🏆';
  if (percentage >= 80) return '⭐';
  if (percentage >= 70) return '👍';
  if (percentage >= 60) return '📈';
  return '📚';
};