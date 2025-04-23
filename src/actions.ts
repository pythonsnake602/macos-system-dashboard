'use server';

import { getSystemMetrics, startSystemMetrics, SystemMetrics } from "./system-metrics.ts";

startSystemMetrics()

export function getMetrics(): SystemMetrics {
  return getSystemMetrics();
}
