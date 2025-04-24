"use client";

import { BarElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Cluster } from '@/system-metrics';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function CPUInfo({ clusters }: { clusters: Array<Cluster> }) {
  // Prepare CPU utilization data for the chart
  const prepareCpuUtilizationData = () => {
    const cpus = clusters.flatMap((cluster) => cluster.cpus);

    const labels = cpus.map((cpu) => `CPU ${cpu.cpu}`);
    const utilizationData = cpus.map((cpu) => (1 - cpu.idle_ratio) * 100);

    return {
      labels,
      datasets: [
        {
          label: 'CPU Utilization (%)',
          data: utilizationData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f3f4f6',
        },
      },
      title: { display: true, text: 'CPU Utilization', color: '#f3f4f6' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Utilization (%)', color: '#f3f4f6' },
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
    <div className="h-full w-full bg-slate-800 rounded-lg flex flex-col">
      {clusters.length > 0 && clusters.some((c) => c.cpus.length > 0) ? (
        <Bar
          data={prepareCpuUtilizationData()}
          options={chartOptions}
          className="h-full w-full"
        />
      ) : (
        <p className="text-gray-100 text-center pt-32">No CPU data available</p>
      )}
    </div>
  );
}
