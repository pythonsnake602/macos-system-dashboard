"use client";

import { SystemMetrics } from "../system-metrics";

export function Dashboard({ metrics }: { metrics: SystemMetrics }) {
  return (
    <div>
      {JSON.stringify(metrics, null, 2)}
    </div>
  );
}