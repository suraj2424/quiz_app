import { Line, Doughnut } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface ChartDataPoint {
  date: string;
  score: number;
}

interface DoughnutDataPoint {
  correct: number;
  incorrect: number;
}

interface LineChartProps {
  data: ChartDataPoint[];
  customOptions?: ChartOptions<'line'>;
}

export const LineChart = ({ data, customOptions = {} }: LineChartProps) => {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: string | number) => `${Number(value)}%`
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Trend'
      }
    }
  };

  const chartData = {
    labels: data.map(point => point.date),
    datasets: [{
      data: data.map(point => point.score),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = { ...defaultOptions, ...customOptions };
  return <Line data={chartData} options={options} />;
};

export const DoughnutChart = ({ data }: { data: DoughnutDataPoint }) => {
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [data.correct, data.incorrect],
      backgroundColor: [
        'rgb(74, 222, 128)',
        'rgb(248, 113, 113)'
      ],
      hoverOffset: 4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Answer Distribution'
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};