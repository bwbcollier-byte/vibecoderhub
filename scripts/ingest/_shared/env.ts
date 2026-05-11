// Minimal env loader for ingestion scripts.
// Reads .env.local then .env. Does NOT validate via lib/env.ts (which is
// strict and Next-runtime-tuned). Ingestion scripts only need a handful of
// vars and should fail soft when optional keys are missing.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadDotenv(file: string) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;
  const body = readFileSync(path, 'utf8');
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

let loaded = false;
export function loadEnv() {
  if (loaded) return;
  loaded = true;
  loadDotenv('.env.local');
  loadDotenv('.env');
}

loadEnv();

export function getEnv(name: string): string | undefined {
  const v = process.env[name];
  if (!v) return undefined;
  if (v.includes('dummy') || v.includes('your-project-ref') || v === '') return undefined;
  return v;
}

export function requireEnv(name: string): string {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export function hasRealEnv(...names: string[]): boolean {
  return names.every((n) => getEnv(n) !== undefined);
}
