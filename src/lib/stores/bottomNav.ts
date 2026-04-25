import { writable } from 'svelte/store';

export interface ProjectNavLinks {
  githubLink?: string;
  productLink?: string;
}

export const projectNavLinks = writable<ProjectNavLinks | null>(null);
