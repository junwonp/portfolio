import { useEffect, useState } from "react";

interface AccordionStateData {
  companies: string[];
  projects: string[];
}

const state: AccordionStateData = {
  companies: [],
  projects: [],
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
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
      state.companies = [];
    } else {
      state.companies = [name];
    }
    notify();
  },

  isProjectOpen: (company: string, projectTitle: string) =>
    state.projects.includes(`${company}::${projectTitle}`),
  toggleProject(company: string, projectTitle: string): void {
    const key = `${company}::${projectTitle}`;
    if (state.projects.includes(key)) {
      state.projects = [];
    } else {
      state.projects = [key];
    }
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
