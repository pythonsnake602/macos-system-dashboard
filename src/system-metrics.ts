import { spawn } from "node:child_process";
import plist from "plist";
import { z } from "zod";

const DvfmStateSchema = z.object({
  freq: z.number(),
  used_ns: z.number(),
  used_ratio: z.number(),
});

const SwRequestedStateSchema = z.object({
  sw_req_state: z.string(),
  used_ns: z.number(),
  used_ratio: z.number(),
});

const SwStateSchema = z.object({
  sw_state: z.string(),
  used_ns: z.number(),
  used_ratio: z.number(),
});

const CPUSchema = z.object({
  cpu: z.number(),
  freq_hz: z.number(),
  idle_ns: z.number(),
  idle_ratio: z.number(),
  dvfm_states: z.array(DvfmStateSchema),
});

const ClusterSchema = z.object({
  name: z.string(),
  hw_resid_counters: z.boolean(),
  freq_hz: z.number(),
  idle_ns: z.number(),
  idle_ratio: z.number(),
  dvfm_states: z.array(DvfmStateSchema),
  cpus: z.array(CPUSchema),
});

const NetworkSchema = z.object({
  opackets: z.number(),
  opacket_rate: z.number(),
  ipackets: z.number(),
  ipacket_rate: z.number(),
  obytes: z.number(),
  obyte_rate: z.number(),
  ibytes: z.number(),
  ibyte_rate: z.number(),
});

const DiskSchema = z.object({
  rops_diff: z.number(),
  rops_per_s: z.number(),
  wops_diff: z.number(),
  wops_per_s: z.number(),
  rbytes_diff: z.number(),
  rbytes_per_s: z.number(),
  wbytes_diff: z.number(),
  wbytes_per_s: z.number(),
});

const GPUSchema = z.object({
  freq_hz: z.number(),
  idle_ns: z.number(),
  idle_ratio: z.number(),
  dvfm_states: z.array(DvfmStateSchema),
  sw_requested_state: z.array(SwRequestedStateSchema),
  sw_state: z.array(SwStateSchema),
  gpu_energy: z.number(),
});

const PowerMetricsSchema = z.object({
  is_delta: z.boolean(),
  elapsed_ns: z.number(),
  hw_model: z.string(),
  kern_osversion: z.string(),
  kern_bootargs: z.string(),
  kern_boottime: z.number(),
  timestamp: z.date(),
  network: NetworkSchema,
  disk: DiskSchema,
  processor: z.object({
    clusters: z.array(ClusterSchema),
    cpu_energy: z.number(),
    cpu_power: z.number(),
    gpu_energy: z.number(),
    gpu_power: z.number(),
    ane_energy: z.number(),
    ane_power: z.number(),
    combined_power: z.number(),
  }),
  thermal_pressure: z.enum(["Nominal", "Moderate", "Heavy"]),
  gpu: GPUSchema,
});

export type DvfmState = z.infer<typeof DvfmStateSchema>;
export type SwRequestedState = z.infer<typeof SwRequestedStateSchema>;
export type SwState = z.infer<typeof SwStateSchema>;
export type CPU = z.infer<typeof CPUSchema>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type Network = z.infer<typeof NetworkSchema>;
export type Disk = z.infer<typeof DiskSchema>;
export type GPU = z.infer<typeof GPUSchema>;
export type PowerMetrics = z.infer<typeof PowerMetricsSchema>;

export type SystemMetrics = {
  power_metrics: PowerMetrics | null
};

let latestPowerMetricsData: PowerMetrics | null = null;
let buffer = "";
let powermetricsProcess = null;

function startPowermetricsProcess() {
  console.log("Starting powermetrics process...");
  // Clear the buffer when restarting to prevent XML parsing errors
  buffer = "";

  powermetricsProcess = spawn(
    "sudo",
    ["powermetrics", "--samplers", "network,disk,cpu_power,thermal,gpu_power,ane_power", "-i", "1000", "--format", "plist"]
  );

  powermetricsProcess.stdout.on("data", (data) => {
    buffer += data;

    // Check if the buffer contains a complete plist document
    if (buffer.includes("</plist>")) {
      try {
        const completePlist = buffer.substring(0, buffer.indexOf("</plist>") + 8);

        let parsedPlist = plist.parse(completePlist);
        let parsed = PowerMetricsSchema.safeParse(parsedPlist);
        if (parsed.success) {
          latestPowerMetricsData = parsed.data;
        } else {
          console.error("Failed to parse plist data:", parsed.error);
        }

        buffer = buffer.substring(buffer.indexOf("</plist>") + 8); // Remove processed data from buffer
      } catch (error) {
        console.error("Failed to parse plist data:", error);
        buffer = ""; // Clear buffer on error
      }
    }
  });

  powermetricsProcess.stderr.on("data", (data) => {
    console.error(`Powermetrics error: ${data}`);
  });

  powermetricsProcess.on("close", (code, signal) => {
    console.log(`Powermetrics process exited with code ${code} and signal ${signal}`);
    // Restart the process if it exits
    setTimeout(() => {
      console.log("Restarting powermetrics process...");
      startPowermetricsProcess();
    }, 1000); // Wait 1 second before restarting to avoid rapid restarts
  });
}

export function startSystemMetrics() {
  startPowermetricsProcess();
}

export function getSystemMetrics(): SystemMetrics {
  return {
    power_metrics: latestPowerMetricsData
  };
}
