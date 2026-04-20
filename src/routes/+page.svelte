<script lang="ts">
  import BentoSkills from '$lib/components/BentoSkills.svelte';
  import DesktopSideNav from '$lib/components/DesktopSideNav.svelte';
  import EducationList from '$lib/components/EducationList.svelte';
  import ExperienceList from '$lib/components/ExperienceList.svelte';
  import MobileStickyHeader from '$lib/components/MobileStickyHeader.svelte';
  import MobileTabBar from '$lib/components/MobileTabBar.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import Title from '$lib/components/Title.svelte';
  import WorkAccordion from '$lib/components/WorkAccordion.svelte';
  import { getLabels } from '$lib/data/labels';
  import { getResumeData } from '$lib/data/resume';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        location.href = '/print?auto=1';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

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
</script>

<article>
  <MobileStickyHeader
    githubLink={resumeData.introduction.githubLink}
    linkedinLink={resumeData.introduction.linkedinLink}
    name={resumeData.introduction.name}
  />

  <div class="layout">
    <div class="nav-wrapper">
      <DesktopSideNav sections={navSections} />
    </div>
    <div class="main-content">
      <section id="section-intro">
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
        <div class="intro-briefing">
          {#each resumeData.introduction.briefing as line, index (index)}
            <p>{line}</p>
          {/each}
        </div>
      </section>

      <div class="content-wrapper">
        <section id="section-work">
          <SectionHeader title={labels.sectionWork} />
          {#if resumeData.workExperiences}
            <WorkAccordion experiences={resumeData.workExperiences} locale={data.locale} />
          {/if}
        </section>

        <section id="section-skills">
          <SectionHeader title={labels.sectionSkills} />
          {#if resumeData.skills}
            <BentoSkills skills={resumeData.skills} />
          {/if}
        </section>

        <section id="section-projects">
          <SectionHeader title={labels.sectionAwards} />
          {#if resumeData.otherExperiences}
            <ExperienceList experiences={resumeData.otherExperiences} />
          {/if}
        </section>

        <section id="section-education">
          <SectionHeader title={labels.sectionEducation} />
          {#if resumeData.education}
            <EducationList education={resumeData.education} />
          {/if}

          <SectionHeader title={labels.sectionArchives} />
          {#if resumeData.archives}
            <ExperienceList experiences={resumeData.archives} />
          {/if}
        </section>
      </div>
    </div>
  </div>

  <MobileTabBar />
</article>

<style>
  .layout {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
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
  }

  /* Handle overlap on intermediate screens by moving nav into the flex flow */
  @media (max-width: 1400px) {
    .layout {
      justify-content: flex-start;
      gap: var(--space-md);
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

  @media (max-width: 960px) {
    .layout {
      display: block;
    }
  }

  @media print {
    :global(body) {
      visibility: hidden;
    }

    p {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .content-wrapper > section {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
