"use client";

import { formatBytes } from '@/format-utils';
import type { Network } from '@/system-metrics.ts';

export function NetworkInfo({ network }: { network: Network }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md @container">
      <h2 className="text-xl font-bold mb-2">Network</h2>
      <div className="grid @md:grid-cols-2 grid-cols-1 gap-2">
        <div>
          <p>
            <span className="font-semibold">Packets In:</span>{' '}
            {network.ipackets.toLocaleString()} (
            {network.ipacket_rate.toFixed(2)}/s)
          </p>
          <p>
            <span className="font-semibold">Packets Out:</span>{' '}
            {network.opackets.toLocaleString()} (
            {network.opacket_rate.toFixed(2)}/s)
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Bytes In:</span>{' '}
            {formatBytes(network.ibytes)} ({formatBytes(network.ibyte_rate)}/s)
          </p>
          <p>
            <span className="font-semibold">Bytes Out:</span>{' '}
            {formatBytes(network.obytes)} ({formatBytes(network.obyte_rate)}/s)
          </p>
        </div>
      </div>
    </div>
  );
}
