# Job Search Content Audit

Date: 2026-05-23

This note documents why the current portfolio may be underperforming at resume-screening stage and what content should be strengthened before more applications are sent.

## Current Diagnosis

The portfolio already has strong raw material: product ownership, React Native/Expo, SvelteKit, Next.js, SwiftUI, CloudKit, performance work, and agentic workflow. The issue is not a lack of experience. The main risk is that the first-screen story is too broad and not yet mapped tightly enough to recruiter filters.

Likely rejection causes:

1. The homepage is still centered on one product success story.
   - The hero metrics are almost entirely from `aira`: MAU, average session time, Google Play rank.
   - This proves startup/product ownership, but it can make the profile look like a founder/product generalist instead of an immediately matchable frontend engineer.
   - For frontend roles, the first screen should make the target role obvious: production frontend, React/React Native, performance, UI systems, and cross-platform delivery.

2. The portfolio has strong project depth, but the scan path is too long.
   - `aira` is convincing, but many of its strongest signals are below the fold in the detail page.
   - Recruiters or ATS-like screeners may only see the headline, job title, and first few bullets.
   - Important keywords such as React Native, Expo, TanStack Query, performance, design system, accessibility, testing, and CI/CD should appear closer to the top-level resume view.

3. Recent projects may look like side projects unless evidence is added.
   - `Day Planner`, `Today’s Weather`, and `Agentic Workflow` show strong initiative, but need more screenshots, measurable outcomes, and usage/verification evidence.
   - Without proof, recent personal projects can read as "interesting but unvalidated."
   - Add screenshots, performance checks, test/build evidence, before/after screenshots, and concrete implementation artifacts.

4. The AI/agentic workflow story is useful but can create skepticism.
   - Current hiring screens increasingly treat AI-assisted resumes and portfolios with caution.
   - The profile should frame AI as engineering leverage with verification, tests, browser checks, and architecture control.
   - Avoid sounding like "AI wrote the code." Emphasize that AI is used as tooling under strict review, validation, and system design.

5. The mobile portfolio currently has a real rendering issue.
   - Mobile home and project detail screenshots show horizontal overflow.
   - This can directly damage trust for frontend roles because the portfolio itself demonstrates responsive quality.
   - Fix before using the site heavily in applications.

6. Some entries are too generic for a competitive funnel.
   - `Admin Dashboard`, `MND Dashboard`, and `Campus Town` need sharper bullets.
   - Generic claims like "built reusable CRUD components" or "managed Redux state" do not separate the candidate from other frontend applicants.
   - Add scale, constraints, usage context, ownership, and measurable impact where available.

## External Hiring Context

Checked current 2026 market signals:

- BLS projects strong long-term demand for software developers, QA analysts, and testers, with 15% growth from 2024 to 2034.
- LinkedIn reports that many job seekers feel unprepared for AI-driven hiring processes and that recruiters are using AI-assisted tools to identify and shortlist candidates.
- Recent research on AI skills in hiring found that AI skills can improve interview invitation probability, but only when they are credible and tied to real work.
- Recent recruiting commentary also warns that generic or AI-polished resumes can be distrusted when they do not show proof of actual ownership.

Practical implication:

The portfolio should not only say "Frontend Engineer." It should make the first 10 seconds answer:

- What kind of frontend engineer is this?
- Which stack can this person ship in production?
- What proof exists beyond claims?
- Is this person applying for this specific role, or sending a generic portfolio?

## Recommended Positioning

Primary positioning:

> Frontend Engineer specializing in production UI systems, cross-platform React Native/Expo delivery, and performance-focused web/mobile products.

Secondary positioning:

> Uses AI/agentic workflows as an engineering acceleration layer, with strict review, testing, and browser/runtime verification.

Avoid leading with:

- "AI agent orchestrator" as the main identity.
- Too much Swift/macOS before establishing frontend relevance.
- Founder/product ownership without tying it back to frontend execution.

## Homepage Changes To Consider

### Hero

Current signal:

- Product lifecycle and growth.
- Strong but broad.

Recommended signal:

- Production frontend execution.
- Cross-platform React Native + web delivery.
- Performance and UI systems.
- Product ownership as a differentiator, not the only identity.

Potential pillar rewrite direction:

1. Production Frontend & UI Systems
   - React, React Native, SvelteKit, design tokens, state/data architecture.

2. Cross-platform Product Delivery
   - Android/iOS/Web, Expo, EAS, Sentry, release operations.

3. Performance & Verification
   - FlashList, React Compiler, bundle optimization, browser checks, tests, CI.

### Featured Projects

Default homepage should surface a clearer frontend hiring path:

1. `aira`
   - Main proof of production React Native, scale, and ownership.

2. `CameraFi Studio`
   - Main proof of web SaaS, performance, payment/auth, and solo frontend architecture.

3. `Today’s Weather`
   - Main proof of modern Next.js/React/Expo/shared architecture, but only after adding more visual and verification evidence.

4. `SvelteKit Portfolio`
   - Proof of frontend craft and performance, but should not outrank product projects.

## Project-Level Content Gaps

### aira

Status: Strongest project.

Keep:

- Metrics: 23k MAU, $3k monthly revenue, 46 min session, Google Play #57.
- Streaming UI, cache patching, FlashList, MMKV persistence, migration, React Compiler.
- Business-model retrospective.

Improve:

- Make Korean metric label fully Korean: `Monthly Active Users` -> `월간 활성 사용자`.
- Consider adding a one-line "What I owned" summary near the top: product planning, frontend architecture, release operations, monetization UI.
- Keep AI tools in the tech stack secondary; do not let them compete with React Native/Expo/TanStack Query.

### CameraFi Studio

Status: Strong, but could be more recruiter-scannable.

Improve:

- Add number of major screens/components if known.
- Add payment/auth ownership more visibly in homepage summary.
- Clarify whether this was production SaaS with real users/revenue impact.
- If possible, add screenshots of editor/scoreboard/control surfaces beyond the optimization chart.

### Admin Dashboard

Status: Too generic.

Improve:

- Add number of admin pages or CRUD modules built.
- Add examples of entities managed, table complexity, filters, permissions, or export/report workflows.
- If measurable, add time saved by reusable CRUD/table components.

### MND Excel Viewer

Status: Technically strong.

Improve:

- Add rough dataset size: rows, columns, document size, or concurrent users if safe.
- Add a diagram or reconstructed screenshot since original work is private.
- Add a clearer "restricted network constraints" section: offline mocks, no public services, local validation.

### MND Dashboard

Status: Too generic.

Improve:

- Add dashboard domain details that can be disclosed safely.
- Add data volume, refresh behavior, chart types, or navigation improvements.
- If no detail page is planned, strengthen the two homepage bullets.

### Day Planner

Status: Promising, but under-proven.

Improve:

- Add screenshots: iOS day view, macOS menu bar, focus automation, timeline overlaps, CloudKit sync state.
- Add metrics or verification: test count, build targets, sync debounce behavior, timeline overlap cases.
- Explain why this strengthens frontend profile: declarative UI, state synchronization, platform integration, native UX thinking.
- Avoid making "first Swift project" sound like junior positioning. Frame it as "native platform expansion from frontend foundations."

### Today’s Weather

Status: Strong architecture, insufficient proof.

Improve:

- Add screenshots: web forecast, Expo mobile screen, iOS widget, recommendation output.
- Add cache evidence beyond "80%+ API load reduction": request flow, TTL, hit/miss model, region constraint.
- Add tests/build proof: Vitest coverage, shared package tests, widget integration status.
- Clarify current product status: prototype, live service, beta, or personal tool.

### OnelineBank

Status: Good story.

Improve:

- Make the 2021 -> 2026 rebuild story visible on homepage, not only detail page.
- Add what the original hackathon result was: finalist, demo scope, time constraint, individual role.
- Keep the security framing careful: demo banking app, mock API, no real secrets in client bundle.

### Campus Town

Status: Currently too thin.

Improve:

- Add what was selected, by whom, and what concrete support was received.
- Tie it to Orca AI’s business validation rather than listing it as a standalone vague award.
- Add one or two bullets or consider merging into the `aira`/Orca AI narrative.

### SvelteKit Portfolio

Status: Good proof of craft.

Improve:

- Add current mobile overflow fix once complete.
- Update performance claims if Lighthouse data is old.
- Keep noindex/privacy rationale, but make sure recruiters can still access the linked portfolio.

### Election Aggregator

Status: Good archive project.

Improve:

- Keep as archive, not top hiring signal.
- Add team size and exact leadership responsibilities if not already visible enough.
- Avoid over-weighting old JavaScript work in default featured view.

### Agentic Workflow

Status: Differentiating but risky if too abstract.

Improve:

- Add concrete examples: repo-wide migration, test repair, browser verification, content catalog refactor.
- Add "guardrails": lint/check/test, code review, no blind AI output, verification before completion.
- Add before/after workflow diagram or commands.
- Position as engineering process maturity, not as a replacement for engineering ability.

## UX / Technical Fixes

1. Fix mobile horizontal overflow.
   - Affects homepage and project detail pages.
   - Likely sources: long bullets, metric grid, bottom nav, accordion/card content, code tags.

2. Resolve `.svx` module deprecation warnings.
   - Vite logs show mdsvex/Svelte warning: `context="module"` is deprecated.
   - Not currently blocking, but should be cleaned up before major polish.

3. Clean existing `pnpm check` warnings.
   - `src/routes/print/+page.svelte` has unused CSS selector warnings.

4. Re-run visual checks after content changes.
   - Desktop: 1440px.
   - Mobile: 390px and 375px.
   - At minimum: home, `aira`, `today-weather`, `day-planner`.

## Application Strategy Notes

If applications keep failing before interviews, likely causes are not only portfolio quality:

1. Resume and portfolio may not be tailored per job.
   - Default profile is broad.
   - Create role-specific versions: Web Frontend, React Native/Mobile, Full-stack Product Frontend, AI-enabled Frontend.

2. ATS/recruiter screens may not see enough exact-match keywords.
   - For web roles: React, Next.js, TypeScript, TanStack Query, performance, accessibility, testing, CI/CD.
   - For mobile roles: React Native, Expo, EAS, Sentry, FlashList, Reanimated, app release.
   - For startup roles: 0-to-1 product, MAU, monetization, analytics, release operations.

3. The strongest evidence is hidden too deep.
   - Put the strongest matching project near the top for each target role.
   - Use query-based tailored views if needed, but keep the default coherent.

4. The story may look unfocused.
   - React Native, Next.js, SvelteKit, SwiftUI, AI workflow, startup founder, military intranet, banking demo: all are useful, but together they can look scattered.
   - The site needs a tighter "why these experiences form one frontend career arc" explanation.

Recommended default arc:

> I build production frontend systems across web and mobile. I have shipped React Native and web products end-to-end, handled performance and state complexity at scale, and now extend that frontend foundation into native platform integrations and AI-assisted engineering workflows.

## Immediate Priority

1. Fix mobile overflow.
2. Rewrite homepage positioning/pillars for target frontend roles.
3. Strengthen `Today’s Weather` and `Day Planner` with screenshots and measurable proof.
4. Add concrete proof and guardrails to `Agentic Workflow`.
5. Strengthen thin homepage-only projects or reduce their visual priority.
6. Create tailored URL presets for Web Frontend, React Native/Mobile, and AI-enabled Frontend applications.
