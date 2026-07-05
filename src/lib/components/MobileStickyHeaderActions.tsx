"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Ellipsis, Printer, Share2 } from "lucide-react";

import { useLocale } from "@/lib/contexts/LocaleContext";

import Github from "./Icon/Github";
import Linkedin from "./Icon/Linkedin";
import IconLink from "./IconLink";
import styles from "./MobileStickyHeader.module.css";

interface Props {
  githubLink?: string;
  linkedinLink?: string;
  name: string;
}

export default function MobileStickyHeaderActions({
  githubLink,
  linkedinLink,
  name,
}: Props) {
  const { locale, labels, setLocale } = useLocale();

  const [errorMessage, setErrorMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        isMenuOpen &&
        target &&
        !target.closest(`.${styles["more-menu-container"]}`)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const toggleLanguage = () => {
    setErrorMessage("");
    try {
      const newLang = locale === "ko" ? "en" : "ko";
      setLocale(newLang);
    } catch {
      setErrorMessage(labels.languageToggleError);
    }
  };

  async function sharePage(): Promise<void> {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = `${name} | ${labels.resumeTitle}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text: "", title, url: shareUrl });
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
    <div className={styles.actions}>
      <div className={`${styles["lang-toggle-wrapper"]} ${styles["pc-only"]}`}>
        <button
          className={`${styles["lang-toggle"]} glass-effect`}
          onClick={toggleLanguage}
          title={labels.toggleLanguage}
        >
          {locale === "ko" ? "English" : "한국어"}
        </button>
      </div>

      <div className={`${styles["action-group"]} glass-effect`}>
        <button
          className={`${styles["lang-toggle-btn"]} ${styles["mobile-only"]}`}
          onClick={toggleLanguage}
          aria-label={labels.toggleLanguage}
          title={labels.toggleLanguage}
        >
          {locale === "ko" ? "EN" : "KO"}
        </button>

        {githubLink && (
          <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
            <Github width={20} height={20} />
          </IconLink>
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

              {linkedinLink && (
                <>
                  <div className={styles["menu-divider"]} />
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {errorMessage && (
        <span className={styles.error} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
