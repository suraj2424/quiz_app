// utils/chartUtils.ts
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#8B5CF6', // purple-500
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
    '#84CC16', // lime-500
  ];
  
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export const formatChartData = (data: any[], xKey: string, yKey: string) => {
  return {
    labels: data.map(item => item[xKey]),
    datasets: [{
      data: data.map(item => item[yKey]),
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }]
  };
};