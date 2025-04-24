"use server-entry";

import '../client';
import { DashboardPage } from "./Dashboard";
import { SystemMetrics } from "@/system-metrics";
import { getLatestPowerMetricsData } from "@/server/powermetrics";
import { getLatestMemoryPressureData } from "@/server/memory-pressure";
import "../tailwind.css";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export async function Page() {
  const initialMetrics: SystemMetrics = {
    powerMetrics: getLatestPowerMetricsData(),
    memoryPressure: getLatestMemoryPressureData(),
  };

  return (
    <html lang="en">
      <head>
        <title>macOS System Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-slate-900 text-gray-100">
        <div className="p-4 flex flex-col items-stretch">
          <h1 className="text-center text-2xl">macOS System Dashboard</h1>
          <DashboardPage initialMetrics={initialMetrics} />
        </div>
      </body>
    </html>
  );
}
