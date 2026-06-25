import type { HomeContentOverride } from "@/lib/content/editableContent";
import { renderEditableMarkdown } from "@/lib/content/editableContent";
import type { Language } from "@/lib/utils/language";

export type ContentOverrideArea = "home" | "project-detail";

export interface ProjectDetailOverride {
  heading: string;
  html: string;
  markdown: string;
}

interface ContentOverrideRow {
  payload: string;
  target_key: string;
}

interface SaveContentOverrideInput {
  area: ContentOverrideArea;
  locale: Language;
  payload: unknown;
  targetKey: string;
}

const HOME_SECTION_KEYS = new Set<keyof HomeContentOverride>([
  "archives",
  "education",
  "introduction",
  "otherExperiences",
  "skills",
  "workExperiences",
]);

const PUBLISHED_STATUS = "published";

const CONTENT_OVERRIDES_TABLE_SQL = `CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  area TEXT NOT NULL,
  locale TEXT NOT NULL,
  target_key TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(area, locale, target_key, status)
)`;

const CONTENT_OVERRIDES_INDEX_SQL = `CREATE INDEX IF NOT EXISTS idx_content_overrides_lookup
ON content_overrides(area, locale, target_key, status)`;

const createOverrideId = (
  area: ContentOverrideArea,
  locale: Language,
  targetKey: string
) => [area, locale, targetKey, PUBLISHED_STATUS].join(":");

const parseJson = (
  value: string
): { ok: true; value: unknown } | { ok: false } => {
  try {
    return { ok: true, value: JSON.parse(value) as unknown };
  } catch {
    return { ok: false };
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isMissingTableError = (error: unknown): boolean =>
  error instanceof Error &&
  error.message.includes("no such table: content_overrides");

const ensureContentOverridesTable = async (db: D1Database): Promise<void> => {
  await db.prepare(CONTENT_OVERRIDES_TABLE_SQL).run();
  await db.prepare(CONTENT_OVERRIDES_INDEX_SQL).run();
};

export const getPublishedHomeOverride = async (
  db: D1Database | undefined,
  locale: Language
): Promise<HomeContentOverride | null> => {
  if (!db) return null;

  let result;

  try {
    result = await db
      .prepare(
        `SELECT target_key, payload
         FROM content_overrides
         WHERE area = ? AND locale = ? AND status = ?`
      )
      .bind("home", locale, PUBLISHED_STATUS)
      .all<ContentOverrideRow>();
  } catch (error: unknown) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }

  const override: HomeContentOverride = {};

  for (const row of result.results) {
    if (!HOME_SECTION_KEYS.has(row.target_key as keyof HomeContentOverride)) {
      continue;
    }

    const key = row.target_key;
    const parsed = parseJson(row.payload);

    if (!parsed.ok) {
      continue;
    }

    if (key === "introduction") {
      override.introduction = parsed.value as HomeContentOverride["introduction"];
    } else if (key === "education") {
      override.education = parsed.value as HomeContentOverride["education"];
    } else if (key === "workExperiences") {
      override.workExperiences = parsed.value as HomeContentOverride["workExperiences"];
    } else if (key === "otherExperiences") {
      override.otherExperiences = parsed.value as HomeContentOverride["otherExperiences"];
    } else if (key === "archives") {
      override.archives = parsed.value as HomeContentOverride["archives"];
    } else if (key === "skills") {
      override.skills = parsed.value as HomeContentOverride["skills"];
    }
  }

  return Object.keys(override).length > 0 ? override : null;
};

export const getProjectDetailOverrides = async (
  db: D1Database | undefined,
  slug: string,
  locale: Language
): Promise<ProjectDetailOverride[]> => {
  if (!db) return [];

  let result;

  try {
    result = await db
      .prepare(
        `SELECT target_key, payload
         FROM content_overrides
         WHERE area = ? AND locale = ? AND target_key LIKE ? AND status = ?`
      )
      .bind("project-detail", locale, `${slug}::%`, PUBLISHED_STATUS)
      .all<ContentOverrideRow>();
  } catch (error: unknown) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }

  return result.results.flatMap((row) => {
    const heading = row.target_key.replace(`${slug}::`, "");
    if (heading === "techStack") return [];

    const parsed = parseJson(row.payload);
    const markdown =
      parsed.ok &&
      isRecord(parsed.value) &&
      typeof parsed.value.markdown === "string"
        ? parsed.value.markdown
        : "";

    if (!heading || !markdown) return [];

    return [
      {
        heading,
        html: renderEditableMarkdown(markdown),
        markdown,
      },
    ];
  });
};

export const getProjectTechStackOverride = async (
  db: D1Database | undefined,
  slug: string,
  locale: Language
): Promise<string[] | null> => {
  if (!db) return null;

  try {
    const row = await db
      .prepare(
        `SELECT payload
         FROM content_overrides
         WHERE area = ? AND locale = ? AND target_key = ? AND status = ?`
      )
      .bind("project-detail", locale, `${slug}::techStack`, PUBLISHED_STATUS)
      .first<ContentOverrideRow>();

    if (!row) return null;

    const parsed = parseJson(row.payload);
    if (
      parsed.ok &&
      isRecord(parsed.value) &&
      Array.isArray(parsed.value.list)
    ) {
      return parsed.value.list as string[];
    }
  } catch (error: unknown) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }

  return null;
};

export const saveContentOverride = async (
  db: D1Database,
  { area, locale, payload, targetKey }: SaveContentOverrideInput
): Promise<void> => {
  const serializedPayload = JSON.stringify(payload);

  await ensureContentOverridesTable(db);

  await db
    .prepare(
      `INSERT INTO content_overrides (id, area, locale, target_key, payload, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(area, locale, target_key, status)
       DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP`
    )
    .bind(
      createOverrideId(area, locale, targetKey),
      area,
      locale,
      targetKey,
      serializedPayload,
      PUBLISHED_STATUS
    )
    .run();
};
