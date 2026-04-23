<script lang="ts">
  import { skillState } from '$lib/states/skills.svelte';

  interface Props {
    skill: string;
  }
  let { skill }: Props = $props();

  let category = $derived(skillState.getCategory(skill));

  function handleClick(e: MouseEvent | KeyboardEvent) {
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
    skillState.toggle(skill);
  }
</script>

<button
  class={['skill-chip', `cat-${category}`, skillState.has(skill) && 'active']}
  onclick={handleClick}
  onkeydown={handleClick}
  aria-pressed={skillState.has(skill)}
>
  {skill}
</button>

<style>
  .skill-chip {
    --cat-color: var(--color-primary);

    appearance: none;
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--cat-color) 40%, var(--color-bg-divider));
    border-radius: 6px;
    color: var(--cat-color);
    font-size: 0.875rem;
    padding: 0.35rem 0.65rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    display: inline-block;
    transition: all 0.15s ease;
    cursor: pointer;
    font-family: inherit;
    text-align: center;
  }

  .skill-chip:hover {
    color: white;
    background: var(--cat-color);
    border-color: var(--cat-color);
  }

  .skill-chip.active {
    background: var(--cat-color);
    border-color: var(--cat-color);
    color: white;
    font-weight: 700;
    box-shadow: 0 2px 6px color-mix(in srgb, var(--cat-color) 30%, transparent);
  }

  .cat-languages {
    --cat-color: var(--color-cat-languages);
  }
  .cat-frameworks {
    --cat-color: var(--color-cat-frameworks);
  }
  .cat-ui {
    --cat-color: var(--color-cat-ui);
  }
  .cat-state {
    --cat-color: var(--color-cat-state);
  }
  .cat-performance {
    --cat-color: var(--color-cat-performance);
  }
  .cat-backend {
    --cat-color: var(--color-cat-backend);
  }
  .cat-devops {
    --cat-color: var(--color-cat-devops);
  }
  .cat-tools {
    --cat-color: var(--color-cat-tools);
  }
  .cat-ai_workflow {
    --cat-color: var(--color-cat-ai_workflow);
  }

  @media print {
    .skill-chip {
      background: transparent !important;
      border: 1px solid var(--color-bg-divider) !important;
      color: var(--color-bold) !important;
      padding: 0.2rem 0.4rem;
    }
  }
</style>
