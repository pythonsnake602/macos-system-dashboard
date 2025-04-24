"use client";

import { Chart as ChartJS, BarElement, ChartOptions, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Bar } from 'react-chartjs-2';
import type { Processor } from '@/system-metrics';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function PowerConsumptionInfo({ processor }: { processor: Processor}) {
  // Extract power values. Convert mW to W.
  const cpuPower = processor.cpu_power / 1000;
  const gpuPower = processor.gpu_power / 1000;
  const anePower = processor.ane_power / 1000;

  // Chart data
  const data = {
    labels: ['CPU', 'GPU', 'ANE'],
    datasets: [
      {
        label: 'Power Consumption (W)',
        data: [cpuPower, gpuPower, anePower],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f3f4f6',
        },
      },
      title: { display: true, text: 'Power Draw', color: '#f3f4f6' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        title: { display: true, text: 'Power (W)', color: '#f3f4f6' },
        ticks: {
          color: '#f3f4f6',
        },
      },
      x: {
        ticks: {
          color: '#f3f4f6',
        },
      },
    },
  };

  return (
    <div className="h-full w-full bg-slate-800 rounded-lg">
      <Bar data={data} options={options} className="h-full w-full" />
    </div>
  );
}
