import { describe, expect, it } from 'vitest';

import {
  CAREER_ID,
  careerCatalog,
  getProjectDetailComponent,
  PROJECT_ID,
  projectCatalog,
} from '@/lib/portfolio/catalog';

describe('portfolio catalog', () => {
  it('publishes the stable career and project identifiers', () => {
    expect(CAREER_ID).toEqual({
      mnd: 'mnd',
      orcaAi: 'orca_ai',
      vaultMicro: 'vault_micro',
    });
    expect(PROJECT_ID).toEqual({
      adminDashboard: 'admin_dashboard',
      agenticWorkflow: 'agentic_workflow',
      aira: 'aira',
      camerafiStudio: 'camerafi_studio',
      campusTown: 'campus_town',
      dayPlanner: 'day_planner',
      electionAggregator: 'election_aggregator',
      kftcPlatform: 'kftc_platform',
      mndDashboard: 'mnd_dashboard',
      nextjsPortfolio: 'nextjs_portfolio',
      onelineBank: 'onelinebank_rebuild',
      todayWeather: 'today_weather',
      webViewer: 'web_viewer',
    });
  });

  it('keeps catalog identifiers, slugs, routes, and ordering stable', () => {
    const careerIds = careerCatalog.map((career) => career.id);
    const projectIds = projectCatalog.map((project) => project.id);
    const projectSlugs = projectCatalog.map((project) => project.slug);
    const detailPaths = projectCatalog.flatMap((project) =>
      project.detailPath ? [project.detailPath] : [],
    );

    expect(careerIds).toEqual([CAREER_ID.orcaAi, CAREER_ID.vaultMicro, CAREER_ID.mnd]);
    expect(projectIds).toEqual([
      PROJECT_ID.aira,
      PROJECT_ID.camerafiStudio,
      PROJECT_ID.adminDashboard,
      PROJECT_ID.webViewer,
      PROJECT_ID.mndDashboard,
      PROJECT_ID.dayPlanner,
      PROJECT_ID.todayWeather,
      PROJECT_ID.kftcPlatform,
      PROJECT_ID.nextjsPortfolio,
      PROJECT_ID.campusTown,
      PROJECT_ID.electionAggregator,
      PROJECT_ID.onelineBank,
      PROJECT_ID.agenticWorkflow,
    ]);
    expect(new Set(careerIds).size).toBe(careerIds.length);
    expect(new Set(projectIds).size).toBe(projectIds.length);
    expect(new Set(projectSlugs).size).toBe(projectSlugs.length);
    expect(new Set(detailPaths).size).toBe(detailPaths.length);

    for (const project of projectCatalog) {
      const conflictingProject = projectCatalog.find(
        (candidate) => candidate !== project && candidate.slug === project.id,
      );

      expect(
        conflictingProject,
        `${project.id} does not collide with another project's slug`,
      ).toBeUndefined();
    }

    for (const project of projectCatalog.filter((item) => item.detailPath !== undefined)) {
      expect(project.detailPath?.trim(), `${project.id} has a non-empty detail route`).not.toBe('');
    }
  });

  it('locks the project URL and career ownership topology', () => {
    expect(
      projectCatalog.map(({ careerId, detailPath, id, section, slug }) => ({
        careerId,
        detailPath,
        id,
        section,
        slug,
      })),
    ).toEqual([
      {
        careerId: CAREER_ID.orcaAi,
        detailPath: '/projects/aira',
        id: PROJECT_ID.aira,
        section: 'work',
        slug: 'aira',
      },
      {
        careerId: CAREER_ID.vaultMicro,
        detailPath: '/projects/camerafi-studio',
        id: PROJECT_ID.camerafiStudio,
        section: 'work',
        slug: 'camerafi-studio',
      },
      {
        careerId: CAREER_ID.vaultMicro,
        detailPath: '/projects/admin-dashboard',
        id: PROJECT_ID.adminDashboard,
        section: 'work',
        slug: 'admin-dashboard',
      },
      {
        careerId: CAREER_ID.mnd,
        detailPath: '/projects/mnd-excel-viewer',
        id: PROJECT_ID.webViewer,
        section: 'work',
        slug: 'mnd-excel-viewer',
      },
      {
        careerId: CAREER_ID.mnd,
        detailPath: undefined,
        id: PROJECT_ID.mndDashboard,
        section: 'work',
        slug: 'mnd-dashboard',
      },
      {
        careerId: undefined,
        detailPath: undefined,
        id: PROJECT_ID.dayPlanner,
        section: 'other',
        slug: 'day-planner',
      },
      {
        careerId: undefined,
        detailPath: '/projects/today-weather',
        id: PROJECT_ID.todayWeather,
        section: 'other',
        slug: 'today-weather',
      },
      {
        careerId: undefined,
        detailPath: '/projects/kftc-platform',
        id: PROJECT_ID.kftcPlatform,
        section: 'other',
        slug: 'kftc-platform',
      },
      {
        careerId: undefined,
        detailPath: '/projects/nextjs-portfolio',
        id: PROJECT_ID.nextjsPortfolio,
        section: 'other',
        slug: 'nextjs-portfolio',
      },
      {
        careerId: undefined,
        detailPath: undefined,
        id: PROJECT_ID.campusTown,
        section: 'other',
        slug: 'campus-town',
      },
      {
        careerId: undefined,
        detailPath: '/projects/election-aggregator',
        id: PROJECT_ID.electionAggregator,
        section: 'archive',
        slug: 'election-aggregator',
      },
      {
        careerId: undefined,
        detailPath: '/projects/oneline-bank',
        id: PROJECT_ID.onelineBank,
        section: 'archive',
        slug: 'oneline-bank',
      },
      {
        careerId: undefined,
        detailPath: '/projects/agentic-workflow',
        id: PROJECT_ID.agenticWorkflow,
        section: 'other',
        slug: 'agentic-workflow',
      },
    ]);
  });

  it('exports aira as a directly renderable Korean MDX component', async () => {
    const detailModule = await import('@/content/projects/aira/detail.ko.mdx');

    expect(detailModule.default).toBeTypeOf('function');
  });

  it('uses the same catalog source for aira detail MDX components', () => {
    expect(getProjectDetailComponent('aira', 'ko')).toBeDefined();
    expect(getProjectDetailComponent('aira', 'en')).toBeDefined();
    expect(getProjectDetailComponent('mnd-dashboard', 'ko')).toBeUndefined();
  });

  it('assigns every work project to one registered career', () => {
    const careerIds = new Set(careerCatalog.map((career) => career.id));

    for (const project of projectCatalog.filter((item) => item.section === 'work')) {
      if (!project.careerId) {
        throw new Error(`${project.id} must belong to a career`);
      }

      expect(careerIds.has(project.careerId)).toBe(true);
    }
  });

  it('keeps non-work projects independent from a career', () => {
    expect(
      projectCatalog.filter((item) => item.section !== 'work').every((item) => !item.careerId),
    ).toBe(true);
  });
});
