"use server-entry";

import './client';
import { getMetrics } from './actions';
import { Dashboard } from "./dashboard/Dashboard";

export async function Page() {
  let metrics = getMetrics();

  return (
    <html lang="en">
      <head>
        <title>Parcel React Server App</title>
      </head>
      <body>
        <h1>macOS System Dashboard</h1>
        <Dashboard metrics={metrics} />
      </body>
    </html>
  );
}
