import type { Language } from '$lib/utils/language';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      locale: Language;
    }
  }
}

export {};
