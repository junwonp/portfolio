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
  };
}

export const skillState = createSkillState();
