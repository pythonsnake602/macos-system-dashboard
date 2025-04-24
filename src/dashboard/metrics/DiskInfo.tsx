"use client";

import type { Disk } from '@/system-metrics';
import { formatBytes } from "@/formatUtils";

export function DiskInfo({ disk }: { disk: Disk }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md @container">
      <h2 className="text-xl font-bold mb-2">Disk</h2>
      <div className="grid @md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <p>
            <span className="font-semibold">Read Ops:</span>{' '}
            {disk.rops_diff.toLocaleString()} ({disk.rops_per_s.toFixed(2)}/s)
          </p>
          <p>
            <span className="font-semibold">Write Ops:</span>{' '}
            {disk.wops_diff.toLocaleString()} ({disk.wops_per_s.toFixed(2)}/s)
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Read Bytes:</span>{' '}
            {formatBytes(disk.rbytes_diff)} ({formatBytes(disk.rbytes_per_s)}/s)
          </p>
          <p>
            <span className="font-semibold">Write Bytes:</span>{' '}
            {formatBytes(disk.wbytes_diff)} ({formatBytes(disk.wbytes_per_s)}/s)
          </p>
        </div>
      </div>
    </div>
  );
}
