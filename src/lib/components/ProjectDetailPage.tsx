"use client";

import React, { useEffect, useMemo } from "react";

import Badge from "@/lib/components/Badge";
import ProjectToc from "@/lib/components/ProjectToc";
import { getLabels } from "@/lib/data/labels";
import { projectNavLinks } from "@/lib/stores/bottomNav";
import type { PostMetadata } from "@/lib/types/post";
import type { Language } from "@/lib/utils/language";
import { parseHeading } from "@/lib/utils/markdown";

import Github from "./Icon/Github";
import Globe from "./Icon/Globe";
import styles from "./ProjectDetailPage.module.css";

interface Props {
  slug: string;
  locale: Language;
  metadata: PostMetadata;
  children: React.ReactNode;
}

export default function ProjectDetailPage({
  slug,
  locale,
  metadata,
  children,
}: Props) {
  const labels = getLabels(locale);
  const metricColumnCount = Math.min(metadata.metrics?.length ?? 1, 4);

  const githubHref = useMemo(() => {
    if (!metadata.githubLink) return "";
    return metadata.githubLink.startsWith("http")
      ? metadata.githubLink
      : `https://github.com/${metadata.githubLink}`;
  }, [metadata.githubLink]);

  // Set project links in bottom nav store
  useEffect(() => {
    projectNavLinks.set({
      githubLink: metadata.githubLink,
      productLink: metadata.productLink,
    });
    return () => {
      projectNavLinks.set(null);
    };
  }, [metadata.githubLink, metadata.productLink]);

  // Transform headings to split subtitles
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      ".project-article h2"
    );
    headings.forEach((h2) => {
      if (h2.getAttribute("data-transformed")) return;

      const originalText = h2.textContent || "";
      const { emoji, main, sub } = parseHeading(originalText);

      if (sub) {
        const hiddenColon = document.createElement("span");
        const subtitle = document.createElement("span");

        hiddenColon.className = "visually-hidden-colon";
        hiddenColon.textContent = ":";
        subtitle.className = styles["h2-subtitle"];
        subtitle.textContent = sub;

        h2.replaceChildren(`${emoji} ${main}`, hiddenColon, subtitle);
      }
      h2.setAttribute("data-transformed", "true");
    });
  }, [children]);

  return (
    <>
      <div id="intro-header-sentinel"></div>

      {/* Desktop-only sticky header with back link and project links */}
      <header className={styles["project-topbar"]}>
        <div className={styles["topbar-links"]}>
          {githubHref && (
            <a
              className={styles["topbar-link"]}
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github width={15} height={15} />
              GitHub
            </a>
          )}
          {metadata.productLink && (
            <a
              className={`${styles["topbar-link"]} ${styles.primary}`}
              href={metadata.productLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe width={15} height={15} />
              {labels.visitSite}
            </a>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles["nav-wrapper"]}>
          <ProjectToc />
        </div>

        <div className={styles["main-content"]}>
          <div className={styles.content}>
            {/* Hero */}
            <div className={styles.hero}>
              <div className={styles["hero-meta"]}>
                {metadata.role && (
                  <Badge text={metadata.role} color="primary" />
                )}
                {metadata.status && (
                  <Badge text={metadata.status} color="green" />
                )}
                {metadata.date && <Badge text={metadata.date} color="sub" />}
              </div>

              <h1 className={styles["hero-title"]}>{metadata.title || slug}</h1>

              {metadata.tagline ? (
                <p className={styles["hero-tagline"]}>{metadata.tagline}</p>
              ) : (
                metadata.description && (
                  <p className={styles["hero-tagline"]}>
                    {metadata.description}
                  </p>
                )
              )}

              {metadata.metrics && metadata.metrics.length > 0 && (
                <dl
                  className={`${styles["metrics-row"]} ${
                    metricColumnCount === 4 ? styles["has-four-metrics"] : ""
                  }`}
                  style={
                    {
                      "--metric-count": metricColumnCount,
                    } as React.CSSProperties
                  }
                >
                  {metadata.metrics.map((metric) => (
                    <div key={metric.label} className={styles.metric}>
                      <dt className={styles["metric-lbl"]}>{metric.label}</dt>
                      <dd className={styles["metric-val"]}>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* MDX content */}
            <article className={`project-article ${styles["project-article"]}`}>
              {children ? (
                children
              ) : (
                <p className={styles["error-msg"]}>{labels.contentLoadError}</p>
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
