"use client";

import { formatFrequency, formatPercentage } from '@/format-utils';
import type { GPU } from '@/system-metrics.ts';

export function GPUInfo({ gpu }: { gpu: GPU }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">GPU</h2>
      <p>
        <span className="font-semibold">Frequency:</span>{' '}
        {formatFrequency(gpu.freq_hz)}
      </p>
      <p>
        <span className="font-semibold">Idle:</span>{' '}
        {formatPercentage(gpu.idle_ratio)}
      </p>
      <p>
        <span className="font-semibold">Energy:</span>{' '}
        {gpu.gpu_energy ? `${gpu.gpu_energy.toFixed(2)} J` : 'N/A'}
      </p>
      <div className="mt-2">
        <h3 className="text-sm font-semibold">DVFM States</h3>
        {gpu.dvfm_states.length === 0 ? (
          <p className="text-gray-400 text-xs">No DVFM state data available</p>
        ) : (
          <div className="grid grid-cols-2 gap-1 mt-1">
            {gpu.dvfm_states.map((state, index) => (
              <div key={index} className="bg-slate-700 p-1 rounded text-xs">
                <p>
                  {formatFrequency(state.freq)}:{' '}
                  {formatPercentage(state.used_ratio)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
