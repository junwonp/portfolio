import { SKILL } from '$lib/data/skills';

import { defineProject } from '../types';

export const electionAggregatorProject = defineProject({
  id: 'election_aggregator',
  slug: 'election-aggregator',
  section: 'archive',
  dateFrom: '2021-11',
  dateTo: '2021-11',
  detailPath: '/projects/election-aggregator',
  featuredSkills: [
    SKILL.languages.javascript,
    SKILL.frameworks.react,
    SKILL.state.graphql,
    SKILL.backend.awsAmplify,
  ],
  skills: [
    SKILL.languages.javascript,
    SKILL.frameworks.react,
    SKILL.ui.styledComponents,
    SKILL.state.graphql,
    SKILL.backend.awsAmplify,
  ],
  content: {
    en: {
      title: 'Election News Aggregator',
      description:
        'A project for Hanyang University Software Studio 2. As a team leader, I led the entire process of planning, design, and development, experiencing Serverless architecture.',
      summaryDetails: [
        '**[Serverless Architecture]** Architected a real-time news crawler and aggregator using **AWS Amplify** and **GraphQL**, handling high-concurrency during election periods.',
        '**[Leadership]** Led a team of 4 as a project manager, coordinating between design, frontend, and backend tasks to ensure on-time delivery.',
      ],
      detailMetadata: {
        title: 'Election News Aggregator',
        description:
          'AWS Serverless-based election information aggregator — team project collecting and visualizing news, polls, and candidate pledges into a single dashboard.',
        date: '2021-11',
        image: '/images/election-aggregator/1.webp',
        githubLink: 'ITE3068_team8',
        role: 'Team Leader · Full Stack',
        techStack: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
      },
    },
    ko: {
      title: '선거 뉴스 어그리게이터',
      description:
        '한양대학교 소프트웨어 스튜디오 2 프로젝트. 팀장으로서 서버리스 아키텍처 기반의 기획, 디자인, 개발 전 과정을 주도했습니다.',
      summaryDetails: [
        '**[서버리스 아키텍처]** **AWS Amplify**와 **GraphQL**을 사용하여 실시간 뉴스 크롤러 및 어그리게이터를 설계, 선거 기간의 고동시성 트래픽을 안정적으로 처리했습니다.',
        '**[리더십]** 팀장으로서 디자인, 프론트엔드, 백엔드 파트 간의 공정을 조율하고 일정을 관리하여 성공적인 산출물을 도출했습니다.',
      ],
      detailMetadata: {
        title: '대선 뉴스 모아보기',
        description:
          'AWS Serverless 기반의 대선 정보 애그리게이터 — 팀 프로젝트로 뉴스, 여론조사, 후보 공약을 하나의 대시보드로 수집·시각화했습니다.',
        date: '2021-11',
        image: '/images/election-aggregator/1.webp',
        githubLink: 'ITE3068_team8',
        role: 'Team Leader · Full Stack',
        techStack: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
      },
    },
  },
});
