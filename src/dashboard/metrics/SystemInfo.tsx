"use client";

import type { PowerMetrics } from '@/system-metrics';

export function SystemInfo({ powerMetrics }: { powerMetrics: PowerMetrics }) {
  return (
    <div className="h-full w-full bg-slate-800 rounded-lg @container">
      <h2 className="text-xl font-bold mb-2">System Information</h2>
      <div className="grid @lg:grid-cols-2 grid-cols-1 gap-1">
        <div>
          <p>
            <span className="font-semibold">Hardware Model:</span>{' '}
            {powerMetrics.hw_model || 'Unknown'}
          </p>
          <p>
            <span className="font-semibold">OS Version:</span>{' '}
            {powerMetrics.kern_osversion || 'Unknown'}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Boot Time:</span>{' '}
            {powerMetrics.kern_boottime
              ? new Date(powerMetrics.kern_boottime * 1000).toLocaleString()
              : 'Unknown'}
          </p>
          <p>
            <span className="font-semibold">Timestamp:</span>{' '}
            {powerMetrics.timestamp.toLocaleString() || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}

