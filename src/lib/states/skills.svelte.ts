import { skillsShared } from '$lib/data/resume.shared';

// eslint-disable-next-line svelte/prefer-svelte-reactivity
const categoryMap = new Map<string, string>();
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const orderMap = new Map<string, number>();

let index = 0;
for (const category of skillsShared) {
  for (const skill of category.list) {
    categoryMap.set(skill, category.id);
    orderMap.set(skill, index++);
  }
}

export function createSkillState() {
  let selectedTechs = $state<string[]>([]);
  let isPanelOpen = $state(false);

  return {
    get selectedTechs() {
      return selectedTechs;
    },
    get isEmpty() {
      return selectedTechs.length === 0;
    },
    get isPanelOpen() {
      return isPanelOpen;
    },
    has(tech: string) {
      return selectedTechs.includes(tech);
    },
    set selectedTechs(value: string[]) {
      selectedTechs = value;
      if (value.length > 0) isPanelOpen = true;
    },
    toggle(tech: string) {
      isPanelOpen = true;
      if (selectedTechs.includes(tech)) {
        selectedTechs = selectedTechs.filter((t) => t !== tech);
      } else {
        selectedTechs = [...selectedTechs, tech];
      }
    },
    clear() {
      selectedTechs = [];
    },
    close() {
      selectedTechs = [];
      isPanelOpen = false;
    },
    getCategory(tech: string) {
      return categoryMap.get(tech) || 'default';
    },
    sort(skills: string[]) {
      return [...skills].sort((a, b) => {
        const orderA = orderMap.get(a) ?? 999;
        const orderB = orderMap.get(b) ?? 999;
        return orderA - orderB;
      });
    },
  };
}

export const skillState = createSkillState();
