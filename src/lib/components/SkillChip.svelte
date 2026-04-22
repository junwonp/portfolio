<script lang="ts">
  import { skillState } from '$lib/states/skills.svelte';

  interface Props {
    skill: string;
  }
  let { skill }: Props = $props();

  function handleClick(e: MouseEvent | KeyboardEvent) {
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
    skillState.toggle(skill);
  }
</script>

<button
  class={['skill-chip', skillState.has(skill) && 'active']}
  onclick={handleClick}
  onkeydown={handleClick}
  aria-pressed={skillState.has(skill)}
>
  {skill}
</button>

<style>
  .skill-chip {
    appearance: none;
    background: var(--color-basic-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 6px;
    color: var(--color-sub);
    font-size: 0.875rem;
    padding: 0.35rem 0.6rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    display: inline-block;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    font-family: inherit;
    text-align: center;
  }

  .skill-chip:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-basic-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .skill-chip.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
    box-shadow: 0 2px 8px var(--color-shadow);
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
