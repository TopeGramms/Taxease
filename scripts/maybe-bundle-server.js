#!/usr/bin/env node
import { spawnSync } from 'child_process';

// If running on Vercel or SKIP_SERVER_BUNDLE is set, skip bundling the server.
const skip = process.env.VERCEL === '1' || process.env.SKIP_SERVER_BUNDLE === '1';
if (skip) {
  console.log('Skipping server bundle because VERCEL or SKIP_SERVER_BUNDLE is set');
  process.exit(0);
}

// Run esbuild with the same args used previously.
const args = [
  'esbuild',
  'server/index.ts',
  '--platform=node',
  '--packages=external',
  '--bundle',
  '--format=esm',
  '--outdir=dist',
];

// Use npx to ensure local devDependency esbuild is used.
const res = spawnSync('npx', args, { stdio: 'inherit' });
process.exit(res.status);
