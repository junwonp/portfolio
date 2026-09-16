/*
 * Document↔site parity for the A4 document at /portfolio. The document is a
 * projection of the same MDX frontmatter and src/content/home files the site
 * renders, so every field the two surfaces share — the project's role line, its
 * period, its links — must agree. The audit that motivated this gate found the
 * document showing a company job title instead of the project's own role and a
 * period built from a different date field; no page-budget measurement can see
 * that class of drift, because both values occupy the page identically.
 *
 * The comparison is asymmetric on purpose. A value the detail page renders must
 * be reproduced verbatim; a value only the document shows is reported as a
 * fallback, because the projection is allowed to fall back to the company role
 * and the company dates, and a browser cannot tell that apart from drift.
 *
 * Values are read from the rendered elements that own them — the document's
 * project-field hooks, the detail page's hero badges — never from a text search,
 * so a bullet that happens to mention a year or a role cannot satisfy the check.
 *
 * The logic lives here, separate from the browser harness, so the failure cases
 * are unit-testable without a running dev server.
 */

/** Badge variants the detail hero uses; 'primary' is the role, 'sub' the date. */
const BADGE_VARIANTS = new Set([
  'android',
  'green',
  'ios',
  'macos',
  'orange',
  'primary',
  'sub',
  'web',
]);

/** A trailing slash is navigation noise, not a different link. */
export const normalizeUrl = (href) => href.trim().replace(/\/+$/, '');

const list = (values) => `[${values.join(', ')}]`;
const rendered = (value) => (value === null ? 'nothing' : `“${value}”`);

/*
 * The collectors are evaluated inside the page, so they must not close over
 * anything in this module: every helper they need is inlined. They return raw
 * hrefs; compareProjectSurfaces normalizes both sides itself.
 */

/**
 * In-page collector: the slugs the site's own project index links. The index is
 * the site's authoritative statement of which projects have a detail route, so a
 * broken or deleted route still shows up here and cannot silently shrink the
 * compared set.
 */
export const collectIndexProjectSlugs = (projectPrefix) => {
  const slugs = new Set();

  for (const anchor of document.querySelectorAll('a[href]')) {
    const path = (anchor.getAttribute('href') ?? '').split(/[?#]/)[0].replace(/\/+$/, '');
    if (!path.startsWith(`${projectPrefix}/`)) continue;

    const slug = path.slice(projectPrefix.length + 1);
    if (slug && !slug.includes('/')) slugs.add(slug);
  }

  return [...slugs].sort();
};

/**
 * In-page collector: one record per project block. The title doubles as the
 * correlation key, because both surfaces render the same frontmatter title.
 */
export const collectDocumentBlocks = () => {
  const sheet = document.querySelector('[data-document-sheet]');
  if (!sheet) throw new Error('the document sheet is missing');

  const text = (element) => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

  return [...sheet.querySelectorAll('section > article')].map((article) => ({
    links: [...article.querySelectorAll('a[href]')].map((anchor) => anchor.href).sort(),
    period: text(article.querySelector('[data-project-field="period"]')) || null,
    role: text(article.querySelector('[data-project-field="role"]')) || null,
    title: text(article.querySelector('h3')),
  }));
};

/** In-page collector: the fields the project detail hero and topbar show. */
export const collectDetailSurface = () => {
  const hero = document.querySelector('[data-layout-slot="main-content"] header');
  const heading = hero?.querySelector('h1');
  if (!heading) throw new Error('the project detail hero is missing');

  const text = (element) => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const nav = document.querySelector('nav[aria-label="Project links"]');

  return {
    badges: [...hero.querySelectorAll('span.badge')].map((badge) => ({
      text: text(badge),
      variant: [...badge.classList].find((name) => name !== 'badge') ?? '',
    })),
    links: [...(nav?.querySelectorAll('a[href]') ?? [])].map((anchor) => anchor.href).sort(),
    period: text(hero.querySelector('span.badge.sub')) || null,
    role: text(hero.querySelector('span.badge.primary')) || null,
    title: text(heading),
  };
};

const badgeFailure = (slug, field, documentValue, badges) =>
  `${slug} · ${field} · the document renders ${rendered(documentValue)} but no ${field} badge carries it on the detail page (badges: ${list(badges.map((badge) => `${badge.variant}=${badge.text}`))})`;

/**
 * Compares one detail surface against its document block. Returns failure lines
 * that name the project, the field and both values; `notes` carries the
 * legitimate, reportable differences.
 */
export const compareProjectSurfaces = ({ block, detail, slug }) => {
  const failures = [];
  const notes = [];
  const badges = detail.badges ?? [];

  const unknown = badges.filter((badge) => !BADGE_VARIANTS.has(badge.variant));
  if (unknown.length > 0) {
    failures.push(
      `${slug} · badges · the detail hero renders an unrecognised badge variant (${list(unknown.map((badge) => badge.variant))}) — the badge contract this check reads changed`,
    );
  }

  for (const field of ['role', 'period']) {
    const detailValue = detail[field];
    const documentValue = block[field];

    if (detailValue === null) {
      if (documentValue === null) continue;

      // The projection may fall back to the company role/dates; only a mismatch
      // against a rendered badge is drift.
      if (badges.some((badge) => badge.text === documentValue)) {
        failures.push(badgeFailure(slug, field, documentValue, badges));
      } else {
        notes.push(
          `${slug} · ${field} · the document shows ${rendered(documentValue)} while the detail page renders no ${field} badge (projection fallback)`,
        );
      }
      continue;
    }

    if (documentValue !== detailValue) {
      failures.push(
        `${slug} · ${field} · the detail page renders ${rendered(detailValue)} but the document renders ${rendered(documentValue)}`,
      );
    }
  }

  // Links are frontmatter-only on both surfaces, so no fallback applies: the two
  // rendered sets must match exactly, duplicates included.
  const detailLinks = (detail.links ?? []).map(normalizeUrl).sort();
  const documentLinks = (block.links ?? []).map(normalizeUrl).sort();
  if (list(detailLinks) !== list(documentLinks)) {
    failures.push(
      `${slug} · links · the detail page renders ${list(detailLinks)} but the document renders ${list(documentLinks)}`,
    );
  }

  return { failures, notes };
};

/**
 * Pairs the document's blocks with the detail surfaces. `projects` are the routes
 * that resolved, `skippedSlugs` the ones that answered 404; a block that matches
 * neither is a project the document shows but the site cannot open, which is only
 * acceptable for a route the probe confirmed is absent.
 */
export const evaluateParity = ({ blocks, projects, skippedSlugs }) => {
  const failures = [];
  const notes = [];
  const byTitle = new Map();

  for (const block of blocks) {
    if (!block.title) {
      failures.push(`a document block carries no title (role: ${rendered(block.role)})`);
      continue;
    }

    if (byTitle.has(block.title)) {
      failures.push(
        `two document blocks carry the title “${block.title}” — projects must be distinguishable`,
      );
      continue;
    }

    byTitle.set(block.title, block);
  }

  const matched = new Set();
  for (const project of projects) {
    const block = byTitle.get(project.detail.title);
    if (!block) {
      failures.push(
        `${project.slug} · title · the detail page renders “${project.detail.title}” but no document block carries that title`,
      );
      continue;
    }

    matched.add(project.detail.title);
    const compared = compareProjectSurfaces({ block, detail: project.detail, slug: project.slug });
    failures.push(...compared.failures);
    notes.push(...compared.notes);
  }

  const orphans = blocks.filter((block) => block.title && !matched.has(block.title));
  const skipped = [...skippedSlugs].sort();
  if (orphans.length !== skipped.length) {
    failures.push(
      `the content tree and the document disagree about unrouted projects: route(s) 404 — ${list(skipped)} — but block(s) match no route — ${list(orphans.map((block) => `“${block.title}”`))}`,
    );
  }

  /*
   * Canary. Every compared project carries a role and a date today, so reading
   * none of a field across every route means the hero no longer renders the field
   * this check reads — and each comparison above passed vacuously. A field the
   * document shows but the detail page does not would otherwise look like the
   * allowed projection fallback.
   */
  for (const field of ['role', 'period']) {
    const observed = projects.some((project) => project.detail[field] !== null);
    if (projects.length > 0 && !observed) {
      failures.push(
        `no detail page rendered a ${field} (${projects.length} route(s) read) — the hero field this check compares is gone`,
      );
    }
  }

  return { failures, matched: matched.size, notes, orphans, skipped };
};
