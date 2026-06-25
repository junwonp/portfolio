import { useEffect,useState } from "react";

import { skillsShared } from "@/lib/data/resume.shared";

const categoryMap = new Map<string, string>();
const orderMap = new Map<string, number>();

let index = 0;
for (const category of skillsShared) {
  for (const skill of category.list) {
    categoryMap.set(skill, category.id);
    orderMap.set(skill, index++);
  }
}

interface SkillStateData {
  selectedTechs: string[];
  isPanelOpen: boolean;
}

type Listener = (val: SkillStateData) => void;
const listeners = new Set<Listener>();

const state: SkillStateData = {
  selectedTechs: [],
  isPanelOpen: false,
};

function notify() {
  listeners.forEach((l) => l({ ...state }));
}

export const skillState = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener({ ...state });
    return () => {
      listeners.delete(listener);
    };
  },

  get selectedTechs() {
    return state.selectedTechs;
  },

  get isEmpty() {
    return state.selectedTechs.length === 0;
  },

  get isPanelOpen() {
    return state.isPanelOpen;
  },

  has(tech: string) {
    return state.selectedTechs.includes(tech);
  },

  setSelectedTechs(value: string[]) {
    state.selectedTechs = value;
    if (value.length > 0) state.isPanelOpen = true;
    notify();
  },

  toggle(tech: string) {
    state.isPanelOpen = true;
    if (state.selectedTechs.includes(tech)) {
      state.selectedTechs = state.selectedTechs.filter((t) => t !== tech);
    } else {
      state.selectedTechs = [...state.selectedTechs, tech];
    }
    notify();
  },

  clear() {
    state.selectedTechs = [];
    notify();
  },

  close() {
    state.selectedTechs = [];
    state.isPanelOpen = false;
    notify();
  },

  getCategory(tech: string) {
    return categoryMap.get(tech) || "default";
  },

  sort(skills: string[]) {
    return [...skills].sort((a, b) => {
      const orderA = orderMap.get(a) ?? 999;
      const orderB = orderMap.get(b) ?? 999;
      return orderA - orderB;
    });
  },
};

export function useSkillState() {
  const [skillData, setSkillData] = useState<SkillStateData>({
    selectedTechs: [],
    isPanelOpen: false,
  });

  useEffect(() => {
    return skillState.subscribe((val) => {
      setSkillData(val);
    });
  }, []);

  return {
    selectedTechs: skillData.selectedTechs,
    isPanelOpen: skillData.isPanelOpen,
    isEmpty: skillData.selectedTechs.length === 0,
    has: (tech: string) => skillData.selectedTechs.includes(tech),
    toggle: (tech: string) => skillState.toggle(tech),
    clear: () => skillState.clear(),
    close: () => skillState.close(),
    getCategory: (tech: string) => skillState.getCategory(tech),
    sort: (skills: string[]) => skillState.sort(skills),
  };
}
