import { SvelteSet } from 'svelte/reactivity';

import { browser } from '$app/environment';

const STORAGE_KEY = 'accordion-open-state';

function loadFromStorage(): { companies: string[]; projects: string[] } {
  if (!browser) return { companies: [], projects: [] };
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as { companies: string[]; projects: string[] };
  } catch {
    // ignore parse errors
  }
  return { companies: [], projects: [] };
}

function createAccordionState() {
  const initial = loadFromStorage();
  const openCompanies = new SvelteSet<string>(initial.companies);
  const openProjects = new SvelteSet<string>(initial.projects);

  function persist(): void {
    if (!browser) return;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ companies: [...openCompanies], projects: [...openProjects] }),
    );
  }

  return {
    hasCompany: (name: string) => openCompanies.has(name),
    toggleCompany(name: string): void {
      if (openCompanies.has(name)) openCompanies.delete(name);
      else openCompanies.add(name);
      persist();
    },
    isProjectOpen: (company: string, projectTitle: string) =>
      openProjects.has(`${company}::${projectTitle}`),
    toggleProject(company: string, projectTitle: string): void {
      const key = `${company}::${projectTitle}`;
      if (openProjects.has(key)) openProjects.delete(key);
      else openProjects.add(key);
      persist();
    },
  };
}

export const accordionState = createAccordionState();
