<script lang="ts">
  import type { Language } from '$lib/utils/language';

  interface Props {
    locale: Language;
  }

  interface DiagramStep {
    detail: string;
    label: string;
  }

  let { locale }: Props = $props();

  const copy = {
    en: {
      caption: 'Reconstructed system diagram. The original intranet UI and data are not shown.',
      title: 'Restricted document viewer flow',
      steps: [
        {
          label: 'Restricted intranet',
          detail: 'No public services or production data in local development',
        },
        {
          label: 'Mock socket layer',
          detail: 'Same event contract as Socket.IO for offline UI validation',
        },
        {
          label: 'Viewer containers',
          detail: 'Own state, range selection, popovers, and collaboration events',
        },
        {
          label: 'Virtualized renderers',
          detail: 'Grid rows via react-window; variable text lines via react-virtualized',
        },
      ],
    },
    ko: {
      caption: '재구성한 시스템 다이어그램입니다. 원본 인트라넷 UI와 데이터는 포함하지 않았습니다.',
      title: '제한망 문서 뷰어 흐름',
      steps: [
        {
          label: '제한망 인트라넷',
          detail: '로컬 개발에서 외부 서비스와 운영 데이터를 사용하지 않음',
        },
        {
          label: 'Mock 소켓 레이어',
          detail: 'Socket.IO와 동일한 이벤트 계약으로 오프라인 UI 검증',
        },
        {
          label: '뷰어 컨테이너',
          detail: '상태, 영역 선택, Popover, 협업 이벤트를 담당',
        },
        {
          label: '가상화 렌더러',
          detail: '그리드는 react-window, 가변 텍스트 줄은 react-virtualized',
        },
      ],
    },
  } satisfies Record<Language, { caption: string; steps: DiagramStep[]; title: string }>;

  let labels = $derived(copy[locale]);
</script>

<figure class="viewer-diagram" aria-labelledby="mnd-viewer-diagram-title">
  <figcaption>
    <strong id="mnd-viewer-diagram-title">{labels.title}</strong>
    <span>{labels.caption}</span>
  </figcaption>
  <ol class="diagram-flow">
    {#each labels.steps as step, index (step.label)}
      <li class="diagram-node">
        <span class="node-index">{index + 1}</span>
        <strong>{step.label}</strong>
        <span>{step.detail}</span>
      </li>
    {/each}
  </ol>
</figure>

<style>
  .viewer-diagram {
    display: grid;
    gap: var(--space-sm);
    margin: 0 0 var(--space-md);
    padding: var(--space-sm);
    border: 1px solid var(--color-bg-divider);
    border-radius: 18px;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary) 10%, transparent),
        transparent 42%
      ),
      var(--color-basic-bg);
    box-shadow: 0 12px 32px color-mix(in srgb, var(--color-shadow) 70%, transparent);
  }

  figcaption {
    display: grid;
    gap: 4px;
  }

  figcaption strong {
    color: var(--color-bold);
    font-size: 1rem;
  }

  figcaption span {
    color: var(--color-sub);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .diagram-flow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .diagram-node {
    position: relative;
    display: grid;
    align-content: start;
    gap: 8px;
    min-height: 148px;
    padding: 14px;
    border: 1px solid var(--color-bg-subdivider);
    border-radius: 14px;
    background: color-mix(in srgb, var(--color-basic-bg) 88%, var(--color-primary) 12%);
  }

  .diagram-node:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    width: 10px;
    height: 1px;
    background: var(--color-primary);
  }

  .diagram-node strong {
    color: var(--color-bold);
    font-size: 0.95rem;
    line-height: 1.3;
  }

  .diagram-node span:last-child {
    color: var(--color-main);
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .node-index {
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    border-radius: 999px;
    background: var(--color-primary);
    color: var(--color-basic-bg);
    font-size: 0.75rem;
    font-weight: 800;
  }

  @media (max-width: 760px) {
    .diagram-flow {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .diagram-node:not(:last-child)::after {
      display: none;
    }
  }

  @media (max-width: 420px) {
    .viewer-diagram {
      border-radius: 14px;
      padding: 12px;
    }

    .diagram-flow {
      grid-template-columns: 1fr;
    }

    .diagram-node {
      min-height: auto;
    }
  }
</style>
