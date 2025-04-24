"use client";

import type { MemoryPressure } from "@/system-metrics";
import { formatBytes, formatPercentage } from "@/format-utils";

export function MemoryInfo({ memoryPressure }: { memoryPressure: MemoryPressure }) {
  const usedBytes = memoryPressure.memoryUsagePercentage / 100 * memoryPressure.totalMemory;

  return (
    <div className="h-full w-full bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Memory</h2>
      <div>
        <p>
          <span className="font-semibold">Total Memory:</span>{' '}
          {formatBytes(memoryPressure.totalMemory)}
        </p>
        <p>
          <span className="font-semibold">Memory Used:</span>{' '}
          {formatBytes(usedBytes)} ({formatPercentage(memoryPressure.memoryUsagePercentage/100)})
        </p>
      </div>
    </div>
  )
}