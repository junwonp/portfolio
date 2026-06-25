import { useEffect,useState } from "react";

const STORAGE_KEY = "accordion-open-state";

interface AccordionStateData {
  companies: string[];
  projects: string[];
}

let state: AccordionStateData = {
  companies: [],
  projects: [],
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved) as AccordionStateData;
    }
  } catch {
    // ignore parse errors
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const accordionState = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  },

  hasCompany: (name: string) => state.companies.includes(name),
  toggleCompany(name: string): void {
    if (state.companies.includes(name)) {
      state.companies = state.companies.filter((c) => c !== name);
    } else {
      state.companies = [...state.companies, name];
    }
    persist();
    notify();
  },

  isProjectOpen: (company: string, projectTitle: string) =>
    state.projects.includes(`${company}::${projectTitle}`),
  toggleProject(company: string, projectTitle: string): void {
    const key = `${company}::${projectTitle}`;
    if (state.projects.includes(key)) {
      state.projects = state.projects.filter((p) => p !== key);
    } else {
      state.projects = [...state.projects, key];
    }
    persist();
    notify();
  },
};

export function useAccordionState() {
  const [data, setData] = useState<AccordionStateData>({ companies: [], projects: [] });

  useEffect(() => {
    return accordionState.subscribe(() => {
      setData({
        companies: [...state.companies],
        projects: [...state.projects],
      });
    });
  }, []);

  return {
    hasCompany: (name: string) => data.companies.includes(name),
    toggleCompany: (name: string) => accordionState.toggleCompany(name),
    isProjectOpen: (company: string, projectTitle: string) =>
      data.projects.includes(`${company}::${projectTitle}`),
    toggleProject: (company: string, projectTitle: string) =>
      accordionState.toggleProject(company, projectTitle),
  };
}
