<script lang="ts">
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getResumeData } from '$lib/data/resume';

  interface Props {
    techStack: string[];
    locale: 'ko' | 'en';
  }

  let { techStack, locale }: Props = $props();
  let resumeData = $derived(getResumeData(locale));

  let techStackByCategory = $derived(
    resumeData.skills
      .map((category) => ({
        title: category.title,
        id: category.id,
        skills: techStack.filter((skill) => category.list.includes(skill)),
      }))
      .filter((group) => group.skills.length > 0),
  );
</script>

<div class="project-tech-stack">
  <div class="tech-category-grid">
    {#each techStackByCategory as group (group.id)}
      <div class="tech-category">
        <span class="category-title">{group.title}</span>
        <div class="tech-grid">
          {#each group.skills as tech (tech)}
            <SkillChip skill={tech} readonly />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .project-tech-stack {
    margin: 2rem 0 3rem;
  }

  .tech-category-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .tech-category {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .category-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-bold);
    opacity: 0.8;
  }

  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  @media (max-width: 640px) {
    .project-tech-stack {
      margin: 1.5rem 0 2.5rem;
    }
  }
</style>
