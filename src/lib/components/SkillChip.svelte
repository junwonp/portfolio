<script lang="ts">
  import { skillState } from '$lib/states/skills.svelte';

  interface Props {
    skill: string;
    readonly?: boolean;
  }
  let { skill, readonly = false }: Props = $props();

  let category = $derived(skillState.getCategory(skill));

  function handleClick(e: MouseEvent | KeyboardEvent) {
    if (readonly) return;
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
    skillState.toggle(skill);
  }
</script>

<button
  class={['skill-chip', !readonly && skillState.has(skill) && 'active', readonly && 'readonly']}
  style:--cat-color="var(--color-cat-{category})"
  style:--cat-text-hover={category === 'ai_workflow'
    ? 'var(--color-cat-ai_workflow-text, white)'
    : 'white'}
  onclick={handleClick}
  onkeydown={handleClick}
  aria-pressed={!readonly && skillState.has(skill)}
>
  {skill}
</button>

<style>
  .skill-chip {
    --cat-color: var(--color-primary);

    appearance: none;
    background: color-mix(in srgb, var(--cat-color) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--cat-color) 15%, var(--color-bg-divider));
    border-radius: 9999px; /* Capsule shape */
    color: var(--color-sub);
    font-size: 0.875rem; /* 14px for better Apple HIG web readability */
    padding: 0.35rem 0.8rem; /* Balanced padding for 14px font size */
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    font-family: inherit;
    text-align: center;
  }

  .skill-chip:not(.readonly):hover {
    color: var(--cat-color);
    background: color-mix(in srgb, var(--cat-color) 10%, transparent); /* Subtle hover fill */
    border-color: var(--cat-color);
  }

  .skill-chip.active {
    background: color-mix(
      in srgb,
      var(--cat-color) 12%,
      transparent
    ); /* Elegant translucent active fill */
    border-color: var(--cat-color);
    color: var(--cat-color);
    font-weight: 600;
    box-shadow: none; /* Removed heavy shadow for clean HIG look */
  }
</style>
