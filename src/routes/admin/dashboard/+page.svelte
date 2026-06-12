<script lang="ts">
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  // Svelte 5 Props destructuring
  interface Props {
    data: {
      stats: {
        totalSessions: number;
        totalPageViews: number;
        avgDwellTime: number;
        avgScrollDepth: number;
      };
      dailyChart: { date: string; sessions: number; views: number }[];
      topPages: { path: string; views: number; avgDwell: number; avgScroll: number }[];
      topReferrers: { referrer: string; count: number }[];
      topCountries: { country: string; count: number }[];
      error?: string;
    };
  }

  let { data }: Props = $props();

  // 안전장치 및 기본 통계 수치 확보
  let stats = $derived(data.stats);
  let dailyChart = $derived(data.dailyChart);
  let topPages = $derived(data.topPages);
  let topReferrers = $derived(data.topReferrers);
  let topCountries = $derived(data.topCountries);

  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';

  $effect(() => {
    if (browser) {
      // 어드민 대시보드 진입 성공 시, 해당 브라우저의 트래킹 영구 차단 플래그 생성
      localStorage.setItem('junuuon_analytics_ignore', 'true');
    }
  });

  // SVG 라인 차트 계산을 위한 데이터 좌표화
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 30;

  let maxVal = $derived(Math.max(...dailyChart.map((d) => Math.max(d.sessions, d.views)), 10));

  let points = $derived(
    dailyChart.map((d, i) => {
      const x = padding + (i / Math.max(dailyChart.length - 1, 1)) * (chartWidth - padding * 2);
      const ySessions = chartHeight - padding - (d.sessions / maxVal) * (chartHeight - padding * 2);
      const yViews = chartHeight - padding - (d.views / maxVal) * (chartHeight - padding * 2);
      return { x, ySessions, yViews, date: d.date, sessions: d.sessions, views: d.views };
    }),
  );

  let sessionsPath = $derived(
    points.length > 0
      ? `M ${points[0].x} ${points[0].ySessions} ` +
          points
            .slice(1)
            .map((p) => `L ${p.x} ${p.ySessions}`)
            .join(' ')
      : '',
  );

  let viewsPath = $derived(
    points.length > 0
      ? `M ${points[0].x} ${points[0].yViews} ` +
          points
            .slice(1)
            .map((p) => `L ${p.x} ${p.yViews}`)
            .join(' ')
      : '',
  );

  // 툴팁 상호작용 관련 로컬 상태
  let activeDot = $state<{
    x: number;
    ySessions: number;
    yViews: number;
    date: string;
    sessions: number;
    views: number;
  } | null>(null);
</script>

<svelte:head>
  <title>Admin Dashboard — Portfolio</title>
</svelte:head>

<div class="dashboard-container">
  <header class="dashboard-header">
    <div>
      <h1>분석 대시보드</h1>
      <p class="subtitle">Cloudflare Edge 기반 실시간 방문자 행동 분석</p>
    </div>
    <form method="POST" action="?/logout" use:enhance>
      <button type="submit" class="logout-btn">로그아웃</button>
    </form>
  </header>

  {#if data.error}
    <div class="alert-box error">
      <p>{data.error}</p>
    </div>
  {/if}

  <!-- 1. 통계 요약 카드 섹션 -->
  <section class="metrics-grid">
    <div class="metric-card glass">
      <div class="card-label">총 세션 수</div>
      <div class="card-value">{stats.totalSessions}</div>
      <div class="card-desc">고유 방문자 수 (어드민 제외)</div>
    </div>
    <div class="metric-card glass">
      <div class="card-label">총 페이지 뷰</div>
      <div class="card-value">{stats.totalPageViews}</div>
      <div class="card-desc">누적 기록된 페이지 조회 수</div>
    </div>
    <div class="metric-card glass">
      <div class="card-label">평균 체류 시간</div>
      <div class="card-value">{stats.avgDwellTime}초</div>
      <div class="card-desc">페이지별 평균 머무른 시간</div>
    </div>
    <div class="metric-card glass">
      <div class="card-label">평균 스크롤 깊이</div>
      <div class="card-value">{stats.avgScrollDepth}%</div>
      <div class="card-desc">사용자가 페이지를 내려본 평균 비율</div>
    </div>
  </section>

  <!-- 2. 최근 트래픽 차트 섹션 -->
  <section class="chart-section glass">
    <h3>체류 및 세션 트렌드</h3>
    <p class="section-subtitle">페이지 뷰(초록) 및 세션(파랑) 시각화</p>

    {#if dailyChart.length === 0}
      <div class="empty-state">트렌드 차트를 표시할 데이터가 없습니다.</div>
    {:else}
      <div class="chart-wrapper">
        <svg viewBox="0 0 {chartWidth} {chartHeight}" class="svg-chart">
          <!-- 격자 보조선 -->
          <line
            x1={padding}
            y1={padding}
            x2={chartWidth - padding}
            y2={padding}
            class="grid-line"
          />
          <line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - padding}
            y2={chartHeight / 2}
            class="grid-line"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            class="grid-line"
          />

          <!-- 라인 드로잉 -->
          {#if viewsPath}
            <path
              d={viewsPath}
              fill="none"
              stroke="var(--color-primary, #10b981)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          {/if}
          {#if sessionsPath}
            <path
              d={sessionsPath}
              fill="none"
              stroke="var(--color-accent, #3b82f6)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          {/if}

          <!-- 마우스 인터랙션 닷 포인트 -->
          {#each points as pt (pt.date)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <circle
              cx={pt.x}
              cy={pt.yViews}
              r={activeDot?.date === pt.date ? '7' : '4'}
              fill="var(--color-primary, #10b981)"
              class="interactive-dot"
              onmouseenter={() => (activeDot = pt)}
              onmouseleave={() => (activeDot = null)}
            />
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <circle
              cx={pt.x}
              cy={pt.ySessions}
              r={activeDot?.date === pt.date ? '7' : '4'}
              fill="var(--color-accent, #3b82f6)"
              class="interactive-dot"
              onmouseenter={() => (activeDot = pt)}
              onmouseleave={() => (activeDot = null)}
            />
          {/each}
        </svg>

        <!-- 실시간 마우스 툴팁 인터랙션 -->
        {#if activeDot}
          <div
            class="chart-tooltip"
            style="left: {activeDot.x}px; top: {Math.min(activeDot.ySessions, activeDot.yViews) -
              40}px;"
          >
            <div class="tooltip-date">{activeDot.date}</div>
            <div class="tooltip-row">
              <span class="dot blue"></span> 세션 수: <strong>{activeDot.sessions}</strong>
            </div>
            <div class="tooltip-row">
              <span class="dot green"></span> 조회 수: <strong>{activeDot.views}</strong>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </section>

  <!-- 3. 상세 통계 그리드 (인기 페이지, 국가/경로 분배) -->
  <div class="details-grid">
    <!-- 3.1 인기 페이지 테이블 -->
    <div class="details-card glass table-card">
      <h3>가장 많이 방문한 페이지</h3>
      {#if topPages.length === 0}
        <div class="empty-state">아직 기록된 방문자 정보가 없습니다.</div>
      {:else}
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>페이지 경로</th>
                <th class="num">조회 수</th>
                <th class="num">평균 체류</th>
                <th class="num">평균 스크롤</th>
              </tr>
            </thead>
            <tbody>
              {#each topPages as page (page.path)}
                <tr>
                  <td class="path-cell" title={page.path}>{page.path}</td>
                  <td class="num">{page.views}</td>
                  <td class="num">{page.avgDwell}초</td>
                  <td class="num">{page.avgScroll}%</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- 3.2 유입 소스 및 유입 국가 리스트 -->
    <div class="details-card glass flex-card">
      <div class="sub-section">
        <h3>주요 유입 소스 (Referrer)</h3>
        {#if topReferrers.length === 0}
          <div class="empty-state">기록된 유입 경로 정보가 없습니다.</div>
        {:else}
          <ul class="progress-list">
            {#each topReferrers as ref (ref.referrer)}
              <li>
                <div class="list-label">
                  <span class="label-text" title={ref.referrer}>{ref.referrer}</span>
                  <span class="label-val">{ref.count}</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill blue"
                    style="width: {(ref.count / Math.max(...topReferrers.map((r) => r.count))) *
                      100}%"
                  ></div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="sub-section spacer-top">
        <h3>주요 접속 국가</h3>
        {#if topCountries.length === 0}
          <div class="empty-state">기록된 국가 정보가 없습니다.</div>
        {:else}
          <ul class="progress-list">
            {#each topCountries as c (c.country)}
              <li>
                <div class="list-label">
                  <span class="label-text"
                    >{c.country === 'unknown' ? '직접 유입 / VPN' : c.country}</span
                  >
                  <span class="label-val">{c.count}</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill green"
                    style="width: {(c.count / Math.max(...topCountries.map((co) => co.count))) *
                      100}%"
                  ></div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 1rem auto;
    width: 100%;
  }

  .dashboard-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid var(--color-bg-divider);
    padding-bottom: 1.5rem;
  }

  h1 {
    margin: 0;
  }

  .subtitle {
    color: var(--color-sub);
    font-size: 0.9375rem;
    margin: 0.25rem 0 0 0;
  }

  .logout-btn {
    background: transparent;
    border: 1px solid var(--color-bg-divider);
    border-radius: 10px;
    color: var(--color-sub);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .logout-btn:hover {
    background: var(--color-surface-hover);
    color: var(--color-bold);
    border-color: var(--color-bold);
  }

  /* 디자인 시스템 표준 카드 디자인 적용 */
  .glass {
    background: var(--color-basic-bg);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    border: 0.5px solid rgba(0, 0, 0, 0.03);
    transition: box-shadow 0.2s ease;
  }

  :global(html.dark) .glass {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 0.5px solid rgba(255, 255, 255, 0.05);
  }

  /* 요약 카드 그리드 */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  .metric-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-label {
    color: var(--color-sub);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .card-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: var(--color-bold);
  }

  .card-desc {
    color: var(--color-sub);
    opacity: 0.8;
    font-size: 0.75rem;
  }

  /* 트렌드 차트 섹션 */
  .chart-section {
    position: relative;
  }

  h3 {
    margin: 0;
  }

  .section-subtitle {
    color: var(--color-sub);
    opacity: 0.8;
    font-size: 0.85rem;
    margin: 0.25rem 0 1.5rem 0;
  }

  .chart-wrapper {
    position: relative;
    width: 100%;
  }

  .svg-chart {
    height: auto;
    overflow: visible;
    width: 100%;
  }

  .grid-line {
    stroke: var(--color-bg-divider);
    stroke-width: 1;
  }

  .interactive-dot {
    cursor: pointer;
    transition: r 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* 툴팁 상호작용 */
  .chart-tooltip {
    background: var(--color-basic-bg);
    border: 0.5px solid var(--color-bg-divider);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, -100%);
    transition: all 0.1s ease;
    z-index: 10;
  }

  :global(html.dark) .chart-tooltip {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .tooltip-date {
    font-weight: 600;
    margin-bottom: 0.25rem;
    border-bottom: 0.5px solid var(--color-bg-divider);
    padding-bottom: 0.25rem;
  }

  .tooltip-row {
    align-items: center;
    display: flex;
    gap: 0.4rem;
    margin-top: 0.15rem;
  }

  .dot {
    border-radius: 50%;
    display: inline-block;
    height: 6px;
    width: 6px;
  }

  .dot.blue {
    background: #3b82f6;
  }

  .dot.green {
    background: #10b981;
  }

  /* 테이블 및 기타 정보 분배 섹션 */
  .details-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .details-grid {
      grid-template-columns: 1fr;
    }
  }

  .table-card {
    display: flex;
    flex-direction: column;
  }

  .table-scroll {
    overflow-x: auto;
    width: 100%;
  }

  table {
    border-collapse: collapse;
    font-size: 0.9rem;
    width: 100%;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    border-bottom: 1.5px solid var(--color-bg-divider);
    color: var(--color-sub);
    font-weight: 600;
  }

  td {
    border-bottom: 0.5px solid var(--color-bg-subdivider);
  }

  .path-cell {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .num {
    text-align: right;
  }

  .flex-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .sub-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .spacer-top {
    border-top: 0.5px solid var(--color-bg-divider);
    margin-top: 0;
    padding-top: 1.5rem;
  }

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .list-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .label-text {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-main);
  }

  .label-val {
    color: var(--color-sub);
  }

  .progress-bar {
    background: var(--color-bg-subdivider);
    border-radius: 4px;
    height: 6px;
    overflow: hidden;
    width: 100%;
  }

  .progress-fill {
    border-radius: 4px;
    height: 100%;
    transition: width 0.3s ease;
  }

  .progress-fill.blue {
    background: #3b82f6;
  }

  .progress-fill.green {
    background: #10b981;
  }

  .empty-state {
    color: var(--color-sub);
    opacity: 0.8;
    font-size: 0.9rem;
    padding: 2rem 0;
    text-align: center;
  }

  .alert-box.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    color: #ef4444;
    font-size: 0.9rem;
    padding: 1rem;
    text-align: center;
  }
</style>
