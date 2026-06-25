import { useEffect,useState } from "react";

export interface ProjectNavLinks {
  githubLink?: string;
  productLink?: string;
}

type Listener = (val: ProjectNavLinks | null) => void;
const listeners = new Set<Listener>();
let currentValue: ProjectNavLinks | null = null;

export const projectNavLinks = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(currentValue);
    return () => {
      listeners.delete(listener);
    };
  },
  set(val: ProjectNavLinks | null) {
    currentValue = val;
    listeners.forEach((l) => l(val));
  },
  get() {
    return currentValue;
  },
};

export function useProjectNavLinks() {
  const [links, setLinks] = useState<ProjectNavLinks | null>(currentValue);

  useEffect(() => {
    return projectNavLinks.subscribe((val) => {
      setLinks(val);
    });
  }, []);

  return links;
}
