"use client";

import { Thermal } from "@/system-metrics";

export function ThermalInfo({ thermal }: { thermal: Thermal}) {
  let statusColor = "bg-gray-500";
  let statusText = "Unknown";

  switch (thermal) {
    case "Heavy":
      statusColor = "bg-red-500";
      statusText = "Heavy";
      break;
    case "Moderate":
      statusColor = "bg-orange-500";
      statusText = "Moderate";
      break;
    case "Nominal":
      statusColor = "bg-green-500";
      statusText = "Normal";
      break;
  }

  return (
    <div className="h-full w-full bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Thermal Status</h2>
      <div className="flex flex-col items-center">
        <div
          className={`w-40 h-16 rounded-full flex items-center justify-center ${statusColor} text-white text-2xl font-bold shadow-lg`}>
          {statusText}
        </div>
      </div>
    </div>
  );
}

