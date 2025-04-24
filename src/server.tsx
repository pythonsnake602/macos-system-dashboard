import { spawn } from "node:child_process";

import express from 'express';
import {renderRequest, callAction} from '@parcel/rsc/node';

import {Page} from '@/dashboard/Page';
import { PowerMetrics, PowerMetricsSchema, SystemMetrics } from "@/system-metrics";
import plist from "plist";

let latestPowerMetricsData: PowerMetrics | undefined = undefined;
let buffer = "";
let powermetricsProcess = null;

console.log("Starting powermetrics process...");
// Clear the buffer when restarting to prevent XML parsing errors
buffer = "";

function startPowermetricsProcess() {
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

startPowermetricsProcess();

const app = express();

app.use(express.static('dist'));

app.get('/api/metrics', (req, res) => {
  let metrics: SystemMetrics = {
    powerMetrics: latestPowerMetricsData
  };
  res.status(200).json(metrics);
})

app.get('/', async (req, res) => {
  await renderRequest(req, res, <Page />, {component: Page});
});

app.post('/', async (req, res) => {
  let id = req.get('rsc-action-id');
  let {result} = await callAction(req, id);
  let root: any = <Page />;
  if (id) {
    root = {result, root};
  }
  await renderRequest(req, res, root, {component: Page});
});

app.listen(3000);
console.log('Server listening on port 3000');
