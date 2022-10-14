#!/usr/bin/env zx

import { ok } from 'assert';
// import 'zx/globals';

const res = await $`lsof -i tcp:4200`;

const lines = res.stdout.split('\n');

const line = lines.find((line) => line.startsWith('node'));

if (!line) {
  console.warn(`Process is not run by node`);
} else {
  const cols = line.trim().split(/\s+/);
  const pid = parseInt(cols[1]);
  ok(!isNaN(pid), `Could not parse process id ${pid}`);
  await $`kill -9 ${pid}`;
}
