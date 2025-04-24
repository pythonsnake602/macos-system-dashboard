"use client";

import { useId } from "react";
import { Responsive, WidthProvider, Layouts } from "react-grid-layout";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

import { useLocalStorage, useWakeLock } from "@/hooks";
import { SystemMetrics as SystemMetricsType, SystemMetricsSchema } from '@/system-metrics';

import { CPUInfo } from "./metrics/CPUInfo";
import { DiskInfo } from "./metrics/DiskInfo";
import { GPUInfo } from "./metrics/GPUInfo";
import { NetworkInfo } from "./metrics/NetworkInfo";
import { PowerConsumptionInfo } from "./metrics/PowerConsumptionInfo";
import { SystemInfo } from "./metrics/SystemInfo";
import { ThermalInfo } from "./metrics/ThermalInfo";

const ResponsiveGridLayout = WidthProvider(Responsive);

const queryClient = new QueryClient();

const fetchMetrics = async () => {
  const response = await fetch('/api/metrics');
  if (!response.ok) {
    throw new Error(
      'Failed to fetch powermetrics data. ERROR: ' + (await response.text()),
    );
  }
  const json = await response.json();
  return await SystemMetricsSchema.parseAsync(json) as SystemMetricsType;
};

function WakeLockCheckbox() {
  const checkboxId = useId();
  const [lock, setLock] = useLocalStorage(
    false,
    'macos-system-dashboard-wake-lock',
  );
  useWakeLock(lock);

  return (
    <div className="flex gap-1 items-center">
      <input
        type="checkbox"
        id={checkboxId}
        checked={lock}
        onChange={(e) => setLock(e.target.checked)}
      />
      <label htmlFor={checkboxId}>Keep screen awake</label>
    </div>
  );
}

function SystemMetrics({ metrics }: { metrics: SystemMetricsType }) {
  const defaultLayouts = {
    lg: [
      { i: 'systemInfo', x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'thermalInfo', x: 0, y: 1, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'cpuInfo', x: 1, y: 0, w: 1, h: 4, minW: 1, minH: 2, maxW: 4 },
      { i: 'powerInfo', x: 2, y: 0, w: 1, h: 4, minW: 1, minH: 2, maxW: 4 },
      { i: 'gpuInfo', x: 3, y: 0, w: 1, h: 4, minW: 1, minH: 2, maxW: 4 },
      { i: 'networkInfo', x: 2, y: 6, w: 2, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'diskInfo', x: 0, y: 6, w: 2, h: 2, minW: 1, minH: 2, maxW: 4 },
    ],
    md: [
      { i: 'systemInfo', x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'thermalInfo', x: 0, y: 1, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'cpuInfo', x: 1, y: 0, w: 1, h: 4, minW: 1, minH: 2, maxW: 4 },
      { i: 'powerInfo', x: 2, y: 0, w: 1, h: 4, minW: 1, minH: 2, maxW: 4 },
      { i: 'gpuInfo', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'diskInfo', x: 1, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
      { i: 'networkInfo', x: 2, y: 4, w: 1, h: 2, minW: 1, minH: 2, maxW: 4 },
    ],
  };

  const powerMetrics = metrics.powerMetrics;

  let metricPanels = powerMetrics ? {
    "cpuInfo": <CPUInfo clusters={powerMetrics.processor.clusters} />,
    "diskInfo": <DiskInfo disk={powerMetrics.disk} />,
    "gpuInfo": <GPUInfo gpu={powerMetrics.gpu} />,
    "networkInfo": <NetworkInfo network={powerMetrics.network} />,
    "powerInfo": <PowerConsumptionInfo processor={powerMetrics.processor} />,
    "systemInfo": <SystemInfo powerMetrics={powerMetrics} />,
    "thermalInfo": <ThermalInfo thermal={powerMetrics.thermal_pressure} />,
  } : {};

  const [layouts, setLayouts] = useLocalStorage<Layouts>(defaultLayouts, "macos-system-dashboard-layouts");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <button type="button" className="bg-red-600 hover:bg-red-700 p-2 rounded" onClick={() => setLayouts(defaultLayouts)}>Reset Layout</button>
        <WakeLockCheckbox />
      </div>
      <ResponsiveGridLayout
        className="mb-5"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 3, sm: 3, xs: 2, xxs: 2 }}
        rowHeight={80}
        isDraggable={true}
        isResizable={true}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        compactType="vertical"
        onLayoutChange={(_, allLayouts) => { setLayouts(allLayouts); }}
        margin={[10, 10]}
        containerPadding={[0, 0]}>
        {Object.entries(metricPanels).map(([key, component]) => (
          <div
            key={key}
            className="flex flex-col h-full bg-slate-800 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden select-none">
            <div className="h-2 bg-slate-700 absolute top-0 left-0 right-0 cursor-move rounded-t-lg"></div>
            <div className="p-2.5 h-full overflow-auto">
              {component}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['systemmetrics'],
    queryFn: fetchMetrics,
    refetchInterval: 1000, // Refetch data every 5 seconds
  });

  return (
    <div className="p-2">
      {isLoading && <p>Loading powermetrics data...</p>}

      {isError && (
        <div className="bg-red-800 p-4 rounded">
          <p>Error loading data: {error.message || 'Unknown error'}</p>
        </div>
      )}

      {data && !isError && !isLoading && (
        <SystemMetrics metrics={data} />
      )}
    </div>
  );
}

export function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
