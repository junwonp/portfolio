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
    --cat-text-hover: white;

    appearance: none;
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--cat-color) 40%, var(--color-bg-divider));
    border-radius: 6px;
    color: color-mix(in srgb, var(--cat-color), black 35%);
    :global(html.dark) & {
      color: color-mix(in srgb, var(--cat-color), white 25%);
    }
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

  .skill-chip:not(.readonly):hover {
    color: var(--cat-text-hover);
    background: var(--cat-color);
    border-color: var(--cat-color);
  }

  .skill-chip.active {
    background: var(--cat-color);
    border-color: var(--cat-color);
    color: var(--cat-text-hover);
    font-weight: 700;
    box-shadow: 0 2px 6px color-mix(in srgb, var(--cat-color) 30%, transparent);
  }
</style>
