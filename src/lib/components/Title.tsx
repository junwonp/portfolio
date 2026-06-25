"use client";

import React, { useEffect, useRef,useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Ellipsis, Printer, Share2 } from "lucide-react";

import { useLocale } from "@/lib/contexts/LocaleContext";
import type { MetricItem, PillarItem } from "@/lib/types/about";

import Github from "./Icon/Github";
import Globe from "./Icon/Globe";
import Linkedin from "./Icon/Linkedin";
import IconLink from "./IconLink";
import styles from "./Title.module.css";

interface Props {
  backLink?: string;
  githubLink?: string;
  isHome?: boolean;
  linkedinLink?: string;
  metrics?: MetricItem[];
  name: string;
  pillars?: PillarItem[];
  productLink?: string;
  role: string;
  tagline: string;
}

export default function Title({
  backLink,
  githubLink,
  isHome = false,
  linkedinLink,
  metrics,
  name,
  pillars,
  productLink,
  role,
  tagline,
}: Props) {
  const { locale, labels, setLocale } = useLocale();
  const metricColumnCount = Math.min(metrics?.length ?? 1, 4);

  const [errorMessage, setErrorMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 드롭다운 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isMenuOpen && target && !target.closest(`.${styles["more-menu-container"]}`)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  async function toggleLanguage(): Promise<void> {
    setErrorMessage("");
    try {
      const newLang = locale === "ko" ? "en" : "ko";
      await setLocale(newLang);
    } catch (error) {
      console.error("Failed to update locale:", error);
      setErrorMessage(labels.languageToggleError);
    }
  }

  async function sharePage(): Promise<void> {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = tagline;
    const title = `${name} | ${labels.resumeTitle}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, title, url: shareUrl });
        setIsMenuOpen(false);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  return (
    <header className={styles.header}>
      <div className={`${styles["title-container"]} ${backLink ? styles["with-back"] : ""}`}>
        <h1 className={styles.title}>{name}</h1>
        <div className={`${styles.icons} ${backLink ? styles["with-back"] : ""}`}>
          {backLink && (
            <div className={styles["back-button"]}>
              <Link href={backLink} aria-label={labels.goBack} title={labels.goBack}>
                <ChevronLeft />
              </Link>
            </div>
          )}
          <div className={styles["other-icons-container"]}>
            <div className={styles["other-icons"]}>
              {isHome && (
                <div className={`${styles["lang-toggle-wrapper"]} ${styles["pc-only"]}`}>
                  <button
                    className={`${styles["lang-toggle"]} glass-effect`}
                    onClick={toggleLanguage}
                    title={labels.toggleLanguage}
                  >
                    {locale === "ko" ? "English" : "한국어"}
                  </button>
                </div>
              )}

              <div className={`${styles["action-group"]} glass-effect`}>
                {isHome && (
                  <>
                    <button
                      className={`${styles["lang-toggle-btn"]} ${styles["mobile-only"]}`}
                      onClick={toggleLanguage}
                      title={labels.toggleLanguage}
                      aria-label={labels.toggleLanguage}
                    >
                      {locale === "ko" ? "EN" : "KO"}
                    </button>
                    <div className={`${styles.divider} ${styles["mobile-only"]}`} />
                  </>
                )}

                {githubLink && (
                  <>
                    <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
                      <Github width={20} height={20} />
                    </IconLink>
                    <div className={styles.divider} />
                  </>
                )}

                <div className={styles["more-menu-container"]}>
                  <button
                    className={`${styles["more-button"]} ${isMenuOpen ? styles.active : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    aria-label="More actions"
                    aria-expanded={isMenuOpen}
                  >
                    <Ellipsis size={20} />
                  </button>

                  {isMenuOpen && (
                    <div className={styles["dropdown-menu"]}>
                      <button className={styles["dropdown-item"]} onClick={sharePage}>
                        {isCopied ? (
                          <>
                            <Check size={16} />
                            <span>{labels.linkCopied}</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={16} />
                            <span>{labels.sharePage}</span>
                          </>
                        )}
                      </button>

                      <div className={styles["menu-divider"]} />

                      <button
                        className={styles["dropdown-item"]}
                        onClick={() => {
                          if (typeof window !== "undefined") window.print();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Printer size={16} />
                        <span>{labels.printPage}</span>
                      </button>

                      {(productLink || linkedinLink) && <div className={styles["menu-divider"]} />}

                      {productLink && (
                        <a
                          className={styles["dropdown-item"]}
                          href={productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Globe width={16} height={16} />
                          <span>{labels.goToProductPage}</span>
                        </a>
                      )}

                      {linkedinLink && (
                        <a
                          className={styles["dropdown-item"]}
                          href={linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Linkedin width={16} height={16} />
                          <span>{labels.goToLinkedinPage}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errorMessage && (
              <span className={styles["lang-toggle-error"]} role="alert">
                {errorMessage}
              </span>
            )}
          </div>
        </div>
      </div>
      {role && <h2 className={styles.role}>{role}</h2>}
      <p className={styles.tagline}>{tagline}</p>

      {metrics && metrics.length > 0 && (
        <dl
          className={`${styles["metrics-grid"]} ${metricColumnCount === 4 ? styles["has-four-metrics"] : ""}`}
          style={{ "--metric-count": metricColumnCount } as React.CSSProperties}
        >
          {metrics.map((metric) => (
            <div className={styles["metric-cell"]} key={metric.label}>
              <dt className={styles["metric-label"]}>{metric.label}</dt>
              <dd className={styles["metric-value"]}>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {pillars && pillars.length > 0 && (
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <div className={styles.pillar} key={pillar.index}>
              <span className={styles["pillar-index"]}>{pillar.index}</span>
              <div className={styles["pillar-content"]}>
                <span className={styles["pillar-title"]}>{pillar.title}</span>
                <span className={styles["pillar-desc"]}>{pillar.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
