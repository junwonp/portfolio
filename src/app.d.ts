import type { Language } from '$lib/utils/language';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env?: {
        'portfolio-assets': R2Bucket;
        portfolio_db: D1Database;
      };
      context?: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches?: CacheStorage & { default: Cache };
    }
    interface Locals {
      locale: Language;
    }
  }
}

export {};
