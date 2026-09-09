// `cloudflare:workers` only resolves on the Workers runtime. The vinext
// prerender phase runs the production server under Node, where an eager
// import of this specifier crashes module loading — resolve it lazily so Node
// falls back to no bindings (callers already handle a missing DB) while
// Workers get the real module-level env.
let lazyEnvPromise: Promise<CloudflareEnv | undefined> | undefined;

interface RuntimeEnv {
  portfolio_db?: unknown;
}

export function getCloudflareEnv(): Promise<CloudflareEnv | undefined> {
  if (!lazyEnvPromise) {
    lazyEnvPromise = import('cloudflare:workers')
      .then((mod) => mod.env as CloudflareEnv)
      .catch(() => undefined);
  }

  return lazyEnvPromise;
}

export function resolveDbFromEnv(env: RuntimeEnv | undefined): D1Database | undefined {
  const db = env?.portfolio_db;

  if (db && typeof db === 'object' && 'prepare' in db) {
    return db as D1Database;
  }

  return undefined;
}

export async function getDb(): Promise<D1Database | undefined> {
  return resolveDbFromEnv(await getCloudflareEnv());
}
