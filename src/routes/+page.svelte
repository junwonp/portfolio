<script lang="ts">
  import { fade, slide } from 'svelte/transition';

  import BentoSkills from '$lib/components/BentoSkills.svelte';
  import BottomSkillBar from '$lib/components/BottomSkillBar.svelte';
  import DesktopSideNav from '$lib/components/DesktopSideNav.svelte';
  import EducationList from '$lib/components/EducationList.svelte';
  import ExperienceList from '$lib/components/ExperienceList.svelte';
  import MobileStickyHeader from '$lib/components/MobileStickyHeader.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import Title from '$lib/components/Title.svelte';
  import WorkAccordion from '$lib/components/WorkAccordion.svelte';
  import { getLabels } from '$lib/data/labels';
  import { getResumeData } from '$lib/data/resume';
  import { skillState } from '$lib/states/skills.svelte';

  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let labels = $derived(getLabels(data.locale));
  let navSections = $derived([
    { id: 'section-intro', label: labels.sectionIntro },
    { id: 'section-work', label: labels.sectionWork },
    { id: 'section-skills', label: labels.sectionSkills },
    { id: 'section-projects', label: labels.sectionAwards },
    { id: 'section-education', label: labels.sectionEducation },
  ]);
  let resumeData = $derived(getResumeData(data.locale));

  $effect(() => {
    const saved = localStorage.getItem('scroll-y');
    if (saved) window.scrollTo(0, parseInt(saved, 10));

    const handler = () => {
      localStorage.setItem('scroll-y', String(window.scrollY));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
    };
  });

  // Filtered Data Computations for Selection Mode
  let filteredWork = $derived(
    skillState.isEmpty
      ? resumeData.workExperiences
      : resumeData.workExperiences
          .map((exp) => ({
            ...exp,
            project: exp.project.filter((p) =>
              skillState.selectedTechs.every((tech) => p.skills?.includes(tech)),
            ),
          }))
          .filter((exp) => exp.project.length > 0),
  );

  let filteredProjects = $derived(
    skillState.isEmpty
      ? resumeData.otherExperiences
      : resumeData.otherExperiences.filter((exp) =>
          exp.project.some((p) =>
            skillState.selectedTechs.every((tech) => p.skills?.includes(tech)),
          ),
        ),
  );

  let filteredArchives = $derived(
    skillState.isEmpty
      ? resumeData.archives
      : resumeData.archives.filter((exp) =>
          exp.project.some((p) =>
            skillState.selectedTechs.every((tech) => p.skills?.includes(tech)),
          ),
        ),
  );

  let isAllEmpty = $derived(
    !skillState.isEmpty &&
      filteredWork.length === 0 &&
      filteredProjects.length === 0 &&
      filteredArchives.length === 0,
  );

  let bottomBarHeight = $state(0);
</script>

<article
  style="padding-bottom: {skillState.isPanelOpen
    ? bottomBarHeight + 64
    : 0}px; transition: padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
>
  <MobileStickyHeader
    githubLink={resumeData.introduction.githubLink}
    linkedinLink={resumeData.introduction.linkedinLink}
    name={resumeData.introduction.name}
  />

  <div class={['layout', skillState.isPanelOpen && 'is-selection-mode']}>
    {#if !skillState.isPanelOpen}
      <div class="nav-wrapper" transition:fade={{ duration: 200 }}>
        <DesktopSideNav sections={navSections} />
      </div>
    {/if}

    <div class="main-content">
      {#if !skillState.isPanelOpen}
        <section id="section-intro" transition:slide={{ duration: 300 }}>
          <Title
            isHome
            githubLink={resumeData.introduction.githubLink}
            linkedinLink={resumeData.introduction.linkedinLink}
            metrics={resumeData.introduction.metrics}
            name={resumeData.introduction.name}
            pillars={resumeData.introduction.pillars}
            role={resumeData.introduction.role}
            tagline={resumeData.introduction.tagline}
          />
          <div id="intro-header-sentinel" aria-hidden="true"></div>
        </section>
      {/if}

      <div class="content-wrapper">
        {#if filteredWork.length > 0}
          <section id="section-work" transition:slide={{ duration: 300 }}>
            <SectionHeader title={labels.sectionWork} />
            <WorkAccordion experiences={filteredWork} locale={data.locale} />
          </section>
        {/if}

        {#if !skillState.isPanelOpen}
          <section id="section-skills" transition:slide={{ duration: 300 }}>
            <SectionHeader title={labels.sectionSkills} />
            {#if resumeData.skills}
              <BentoSkills locale={data.locale} skills={resumeData.skills} />
            {/if}
          </section>
        {/if}

        {#if filteredProjects.length > 0}
          <section id="section-projects" transition:slide={{ duration: 300 }}>
            <SectionHeader title={labels.sectionAwards} />
            <ExperienceList experiences={filteredProjects} />
          </section>
        {/if}

        {#if filteredArchives.length > 0}
          <section id="section-archives" transition:slide={{ duration: 300 }}>
            <SectionHeader title={labels.sectionArchives} />
            <ExperienceList experiences={filteredArchives} />
          </section>
        {/if}

        {#if !skillState.isPanelOpen}
          <section id="section-education" transition:slide={{ duration: 300 }}>
            <SectionHeader title={labels.sectionEducation} />
            {#if resumeData.education}
              <EducationList education={resumeData.education} />
            {/if}
          </section>
        {/if}

        {#if isAllEmpty}
          <div class="empty-state" transition:fade={{ duration: 300 }}>
            <div class="empty-icon">📂</div>
            <h3>{labels.noProjectsFound}</h3>
            <button
              class="empty-clear-btn"
              onclick={() => {
                skillState.close();
              }}>{labels.skillFilterClear}</button
            >
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if skillState.isPanelOpen && resumeData.skills}
    <BottomSkillBar skills={resumeData.skills} bind:barHeight={bottomBarHeight} />
  {/if}
</article>

<style>
  .layout {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    transition: all 0.3s ease;
  }

  .nav-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(100% + var(--space-md));
    width: 160px;
  }

  .main-content {
    min-width: 0;
    width: 100%;
    transition: all 0.3s ease;
  }

  /* When in selection mode, expand main-content slightly if needed, or just let it center */
  .layout.is-selection-mode {
    justify-content: center;
  }

  /* Handle overlap on intermediate screens by moving nav into the flex flow */
  @media (max-width: 1400px) {
    .layout {
      justify-content: flex-start;
      gap: var(--space-md);
    }

    .layout.is-selection-mode {
      justify-content: center; /* Re-center when nav is hidden */
    }

    .nav-wrapper {
      position: relative;
      right: auto;
      flex-shrink: 0;
    }

    .main-content {
      flex: 1;
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    text-align: center;
    background: color-mix(in srgb, var(--color-disabled-bg) 50%, transparent);
    border-radius: 16px;
    border: 1px dashed var(--color-bg-divider);
    margin-top: 2rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-bold);
    font-size: 1.25rem;
  }

  .empty-clear-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }

  .empty-clear-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  @media (max-width: 960px) {
    .layout {
      display: block;
    }
  }
</style>
