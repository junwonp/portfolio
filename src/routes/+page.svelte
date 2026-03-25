<script lang="ts">
  import ProjectList from '$lib/components/ProjectList.svelte';
  import Row from '$lib/components/Row.svelte';
  import SideList from '$lib/components/SideList.svelte';
  import Title from '$lib/components/Title.svelte';
  import { getResumeData } from '$lib/data/resume';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const resumeData = $derived(getResumeData(data.locale));

  $effect(() => {
    const handleBeforePrint = () => {
      location.href = '/print?auto=1';
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  });
</script>

<article>
  <Title
    isHome
    githubLink={resumeData.introduction.githubLink}
    linkedinLink={resumeData.introduction.linkedinLink}
    name={resumeData.introduction.name}
    printLink="/print?auto=1"
    role={resumeData.introduction.role}
    tagline={resumeData.introduction.tagline}
  />

  <div class="content-wrapper">
    <div>
      {#each resumeData.introduction.briefing as line, index (index)}
        <p>{line}</p>
      {/each}
    </div>

    <h2>Work Experience</h2>
    {#if resumeData.workExperiences}
      {#each resumeData.workExperiences as experience, experienceIndex (experienceIndex)}
        <Row
          companyName={experience.companyName}
          role={experience.role}
          dateFrom={experience.dateFrom}
          dateTo={experience.dateTo}
        >
          {#snippet additional()}
            {#if experience.additional}
              <a
                href={experience.additional.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={experience.additional.label}
                title={experience.additional.label}
              >
                {experience.additional.label}
              </a>
            {/if}
          {/snippet}
          <ProjectList projects={experience.project} bold />
        </Row>
        {#if experienceIndex < resumeData.workExperiences.length - 1}
          <hr class="row-divider" aria-hidden="true" />
        {/if}
      {/each}
    {/if}

    <h2>Skills Set</h2>
    {#if resumeData.skills}
      <div class="skills-wrapper">
        {#each resumeData.skills as skill (skill.title)}
          <SideList title={skill.title} list={skill.list} />
        {/each}
      </div>
    {/if}

    <h2>Awards & Projects</h2>
    {#if resumeData.otherExperiences}
      {#each resumeData.otherExperiences as experience, experienceIndex (experienceIndex)}
        {#if experience.companyName && experience.dateFrom && experience.role}
          <Row
            companyName={experience.companyName}
            dateFrom={experience.dateFrom}
            role={experience.role}
          >
            <ProjectList projects={experience.project} />
          </Row>
          {#if experienceIndex < resumeData.otherExperiences.length - 1}
            <hr class="row-divider" aria-hidden="true" />
          {/if}
        {:else}
          <ProjectList projects={experience.project} other />
          {#if experienceIndex < resumeData.otherExperiences.length - 1}
            <hr class="row-divider" aria-hidden="true" />
          {/if}
        {/if}
      {/each}
    {/if}

    <!-- <h2>Certificates</h2>
    {#if certificates}
      <ul>
        {#each certificates as certificate (certificate.label)}
          <li>
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={certificate.label}
              title={certificate.label}
            >
              {certificate.label}
            </a>
          </li>
        {/each}
      </ul>
    {/if} -->

    <h2>Education</h2>
    {#if resumeData.education}
      {#each resumeData.education as education, educationIndex (educationIndex)}
        <Row {...education} companyName={education.school} role={education.major ?? ''} />
      {/each}
    {/if}

    <h2>Archives</h2>
    {#if resumeData.archives}
      {#each resumeData.archives as archive, archiveIndex (archiveIndex)}
        <ProjectList projects={archive.project} other />
        {#if archiveIndex < resumeData.archives.length - 1}
          <hr class="row-divider" aria-hidden="true" />
        {/if}
      {/each}
    {/if}
  </div>
</article>

<style>
  .content-wrapper {
    display: flex;
    flex-direction: column;
  }

  .skills-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    word-break: break-word;
  }

  .row-divider {
    background-color: var(--color-bg-divider);
    border: none;
    height: 1px;
    margin: 3rem 0;
    width: 100%;
  }

  @media (max-width: 960px) {
    h2 {
      font-size: 2.5rem;
    }

    .skills-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }

    .row-divider {
      margin: var(--space-sm) 0;
    }
  }

  @media (max-width: 480px) {
    .skills-wrapper {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  @media print {
    :global(body) {
      visibility: hidden;
    }

    p {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    h2 {
      page-break-after: avoid;
      break-after: avoid;
    }

    h2 + * {
      page-break-before: avoid;
      break-before: avoid;
    }

    .content-wrapper > div {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
</style>
