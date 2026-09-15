'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface PricePoint {
  date: string;
  price: number;
}

export default function PriceChart({ data }: { data: PricePoint[] }) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Price ($/MT)',
        data: data.map((d) => d.price),
        borderColor: '#87530a', // primary-800
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(200,134,10,0.1)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(200,134,10,0.35)');
          gradient.addColorStop(1, 'rgba(251,191,36,0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#87530a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#87530a',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fbbf24',
        bodyColor: '#f9fafb',
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => `$${ctx.parsed.y.toLocaleString()}/MT`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9a8878', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f0ece7' },
        ticks: { color: '#9a8878', font: { size: 11 }, callback: (v: any) => `$${v.toLocaleString()}` },
      },
    },
  };

  return <Line data={chartData} options={options as any} />;
}
