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

const ProcessorSchema = z.object({
  clusters: z.array(ClusterSchema),
  cpu_energy: z.number(),
  cpu_power: z.number(),
  gpu_energy: z.number(),
  gpu_power: z.number(),
  ane_energy: z.number(),
  ane_power: z.number(),
  combined_power: z.number(),
});

const ThermalSchema = z.enum(["Nominal", "Moderate", "Heavy"]);

export const PowerMetricsSchema = z.object({
  is_delta: z.boolean(),
  elapsed_ns: z.number(),
  hw_model: z.string(),
  kern_osversion: z.string(),
  kern_bootargs: z.string(),
  kern_boottime: z.number(),
  timestamp: z.coerce.date(),
  network: NetworkSchema,
  disk: DiskSchema,
  processor: ProcessorSchema,
  thermal_pressure: ThermalSchema,
  gpu: GPUSchema,
});

export const SystemMetricsSchema = z.object({
  powerMetrics: z.optional(PowerMetricsSchema),
});

export type DvfmState = z.infer<typeof DvfmStateSchema>;
export type SwRequestedState = z.infer<typeof SwRequestedStateSchema>;
export type SwState = z.infer<typeof SwStateSchema>;
export type CPU = z.infer<typeof CPUSchema>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type Network = z.infer<typeof NetworkSchema>;
export type Disk = z.infer<typeof DiskSchema>;
export type Processor = z.infer<typeof ProcessorSchema>;
export type Thermal = z.infer<typeof ThermalSchema>;
export type GPU = z.infer<typeof GPUSchema>;
export type PowerMetrics = z.infer<typeof PowerMetricsSchema>;
export type SystemMetrics = z.infer<typeof SystemMetricsSchema>;
