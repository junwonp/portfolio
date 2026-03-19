import type { Language } from '$lib/utils/language';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      locale: Language;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
