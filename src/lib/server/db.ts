import { env } from 'cloudflare:workers';

interface RuntimeEnv {
  portfolio_db?: unknown;
}

export function getCloudflareEnv(): CloudflareEnv | undefined {
  return env as CloudflareEnv;
}

export function resolveDbFromEnv(env: RuntimeEnv | undefined): D1Database | undefined {
  const db = env?.portfolio_db;

  if (db && typeof db === 'object' && 'prepare' in db) {
    return db as D1Database;
  }

  return undefined;
}

export function getDb(): D1Database | undefined {
  return resolveDbFromEnv(getCloudflareEnv());
}
