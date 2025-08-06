export const formatTime = (totalTimeSpent: number | string | undefined): string => {
  if (!totalTimeSpent || totalTimeSpent === "0" || totalTimeSpent === 0) return "0m";

  const timeSpent = typeof totalTimeSpent === 'string' ? parseInt(totalTimeSpent, 10) : totalTimeSpent;

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
};

export const formatDetailedTime = (totalTimeSpent: number | string | undefined): string => {
  if (!totalTimeSpent || totalTimeSpent === "0" || totalTimeSpent === 0) return "0 seconds";

  const timeSpent = typeof totalTimeSpent === 'string' ? parseInt(totalTimeSpent, 10) : totalTimeSpent;

  const hours = Math.floor(timeSpent / 3600);
  const minutes = Math.floor((timeSpent % 3600) / 60);
  const seconds = timeSpent % 60;

  const parts: string[] = []; // Explicitly type the array as an array of strings

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }

  if (seconds > 0 && hours === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};
