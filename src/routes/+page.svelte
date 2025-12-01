<script lang="ts">
  import Project from '$lib/components/Project.svelte';
  import Row from '$lib/components/Row.svelte';
  import SideList from '$lib/components/SideList.svelte';
  import Title from '$lib/components/Title.svelte';
  import { getResumeData } from '$lib/data/resume';
  import type { Language } from '$lib/utils/language';
  import { parseMarkdownBold } from '$lib/utils/markdown';

  let { data }: { data: { locale: Language } } = $props();

  const resumeData = $derived(getResumeData(data.locale));

  const introduction = $derived(resumeData.introduction);
  const workExperiences = $derived(resumeData.workExperiences);
  const otherExperiences = $derived(resumeData.otherExperiences);
  const education = $derived(resumeData.education);
  const skills = $derived(resumeData.skills);
  const archives = $derived(resumeData.archives);
</script>

<article>
  <Title
    isHome
    githubLink={introduction.githubLink}
    linkedinLink={introduction.linkedinLink}
    name={introduction.name}
    role={introduction.role}
    tagline={introduction.tagline}
  />

  <div class="content-wrapper">
    <div>
      {#each introduction.briefing as line, index (index)}
        <p>{line}</p>
      {/each}
    </div>

    <h2>Work Experience</h2>
    {#if workExperiences}
      {#each workExperiences as experience, experienceIndex (experienceIndex)}
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
          {#each experience.project as singleProject (singleProject.title)}
            <Project {...singleProject}>
              <ul>
                {#each singleProject.detail as line, detailIndex (detailIndex)}
                  <li>
                    {#each parseMarkdownBold(line) as part, partIndex (partIndex)}
                      {#if part.bold}
                        <strong>{part.text}</strong>
                      {:else}
                        {part.text}
                      {/if}
                    {/each}
                  </li>
                {/each}
              </ul>
            </Project>
          {/each}
        </Row>
        {#if experienceIndex < workExperiences.length - 1}
          <hr class="row-divider" aria-hidden="true" />
        {/if}
      {/each}
    {/if}

    <h2>Skills Set</h2>
    {#if skills}
      <div class="skills-wrapper">
        {#each skills as skill (skill.title)}
          <SideList title={skill.title} list={skill.list} />
        {/each}
      </div>
    {/if}

    <h2>Awards & Projects</h2>
    {#if otherExperiences}
      {#each otherExperiences as experience, experienceIndex (experienceIndex)}
        {#if experience.companyName && experience.dateFrom && experience.role}
          <Row
            companyName={experience.companyName}
            dateFrom={experience.dateFrom}
            role={experience.role}
          >
            {#each experience.project as singleProject (singleProject.title)}
              <Project {...singleProject}>
                <ul>
                  {#each singleProject.detail as line, detailIndex (detailIndex)}
                    <li>{line}</li>
                  {/each}
                </ul>
              </Project>
            {/each}
          </Row>
          {#if experienceIndex < otherExperiences.length - 1}
            <hr class="row-divider" aria-hidden="true" />
          {/if}
        {:else}
          {#each experience.project as singleProject (singleProject.title)}
            <Project {...singleProject} other />
            {#if experienceIndex < otherExperiences.length - 1}
              <hr class="row-divider" aria-hidden="true" />
            {/if}
          {/each}
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
    {#if education}
      {#each education as education, educationIndex (educationIndex)}
        <Row {...education} companyName={education.school} role={education.major ?? ''} />
      {/each}
    {/if}

    <h2>Archives</h2>
    {#if archives}
      {#each archives as archive, archiveIndex (archiveIndex)}
        {#each archive.project as singleProject (singleProject.title)}
          <Project {...singleProject} other />
          {#if archiveIndex < archives.length - 1}
            <hr class="row-divider" aria-hidden="true" />
          {/if}
        {/each}
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
