<script lang="ts">
  import Project from '$lib/components/Project.svelte';
  import type { ProjectItem } from '$lib/types/about';
  import { parseMarkdownBold } from '$lib/utils/markdown';

  interface Props {
    projects: ProjectItem[];
    bold?: boolean;
    other?: boolean;
  }

  let { bold = false, other = false, projects }: Props = $props();
</script>

{#each projects as project (project.title)}
  {#if other}
    <Project {...project} other />
  {:else}
    <Project {...project}>
      <ul>
        {#each project.detail as line, i (i)}
          <li>
            {#if bold}
              {#each parseMarkdownBold(line) as part, j (j)}
                {#if part.bold}
                  <strong>{part.text}</strong>
                {:else}
                  {part.text}
                {/if}
              {/each}
            {:else}
              {line}
            {/if}
          </li>
        {/each}
      </ul>
    </Project>
  {/if}
{/each}
