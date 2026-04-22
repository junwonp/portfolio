<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import Project from '$lib/components/Project.svelte';
  import { skillState } from '$lib/states/skills.svelte';
  import type { ProjectItem } from '$lib/types/about';
  import { parseMarkdownBold } from '$lib/utils/markdown';

  interface Props {
    projects: ProjectItem[];
    bold?: boolean;
    other?: boolean;
  }

  let { bold = false, other = false, projects }: Props = $props();

  let filteredProjects = $derived(
    !skillState.isEmpty
      ? projects.filter((p) => skillState.selectedTechs.every((tech) => p.skills?.includes(tech)))
      : projects,
  );
</script>

<div class="project-container">
  {#each filteredProjects as project (project.title)}
    <div animate:flip={{ duration: 400 }} transition:fade={{ duration: 200 }}>
      {#if other}
        <Project {...project} other />
      {:else}
        <Project {...project}>
          <ul>
            {#each project.detail as line, i (i)}
              <li>
                {#if bold}
                  {#each parseMarkdownBold(line) as part, j (j)}
                    {#if part.type === 'bold'}
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
    </div>
  {/each}
</div>

<style>
  .project-container {
    display: flex;
    flex-direction: column;
  }
</style>
