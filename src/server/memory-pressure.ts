import * as util from "node:util";
import { exec } from "node:child_process";
import { setInterval } from "node:timers";
import { MemoryPressure } from "@/system-metrics";

const promiseExec = util.promisify(exec);

const totalMemoryRegex = /^The system has (\d+)/m;
const memoryPercentageRegex = /^System-wide memory free percentage: (\d+)%$/m;

let latestMemoryPressureData: MemoryPressure | undefined = undefined;

async function getMemoryPressure() {
  const { stdout } = await promiseExec("memory_pressure");

  const memoryPressure: MemoryPressure = {
    totalMemory: parseInt(stdout.match(totalMemoryRegex)?.[1] ?? "0"),
    memoryUsagePercentage: parseInt(stdout.match(memoryPercentageRegex)?.[1] ?? "0"),
  };

  return memoryPressure
}

export function startMemoryPressurePoll() {
  console.log("Starting memory pressure poll...");
  setInterval(async () => {
    latestMemoryPressureData = await getMemoryPressure();
  }, 1000);
}

export function getLatestMemoryPressureData() {
  return latestMemoryPressureData;
}
