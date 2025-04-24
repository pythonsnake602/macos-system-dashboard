import * as fs from "node:fs";
import * as http from "node:http";
import * as https from "node:https";
import { Server } from "node:net";

import express, { Express } from 'express';
import {renderRequest, callAction} from '@parcel/rsc/node';
import yargs from "yargs";

import {Page} from '@/dashboard/Page';
import { getLatestPowerMetricsData, startPowermetricsProcess } from "@/powermetrics";
import { SystemMetrics } from "@/system-metrics";

const argv = yargs(process.argv.slice(2))
  .options({
    host: { type: "string", alias: "h", default: "localhost" },
    port: { type: "number", alias: "p", default: 3000 },
    key: { type: "string" },
    cert: { type: "string"}
  })
  .help()
  .parseSync();

const { host, port, key, cert } = argv;
const useSsl = key && cert;

function createHttpServer(app: Express) { return http.createServer(app) }
function createHttpsServer(app: Express) {
  console.log("Using SSL");

  const options = {
    key: fs.readFileSync(key!),
    cert: fs.readFileSync(cert!)
  };
  return https.createServer(options, app);
}

startPowermetricsProcess();

const app = express();

const server: Server = useSsl ? createHttpsServer(app) : createHttpServer(app);

app.use(express.static('dist'));

app.get('/api/metrics', (req, res) => {
  let metrics: SystemMetrics = {
    powerMetrics: getLatestPowerMetricsData(),
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

server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
