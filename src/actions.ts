'use server';

import { getSystemMetrics, startSystemMetrics, SystemMetrics } from "./system-metrics.ts";

startSystemMetrics()

export async function getMetrics(): Promise<SystemMetrics> {
  return getSystemMetrics();
}
