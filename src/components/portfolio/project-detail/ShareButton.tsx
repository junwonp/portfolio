"use client";

import React, { useRef,useState } from "react";
import { Check, Share2 } from "lucide-react";

import { pillButton } from "@/components/ui/surface.css";

import * as styles from "./ShareButton.css";

interface Props {
  copiedLabel: string;
  shareLabel: string;
  text?: string;
  title?: string;
  url?: string;
  variant?: "icon" | "text";
}

export default function ShareButton({
  copiedLabel,
  shareLabel,
  text,
  title,
  url,
  variant = "icon",
}: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function share(): Promise<void> {
    const shareUrl = url ?? window.location.href;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, title, url: shareUrl });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    await copyToClipboard(shareUrl);
  }

  async function copyToClipboard(shareUrl: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showCopied();
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  }

  function showCopied(): void {
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (variant === "text") {
    return (
      <button
        className={`${styles.shareBtnText} ${copied ? styles.copied : ""}`}
        onClick={share}
        title={shareLabel}
        aria-label={shareLabel}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check size={15} strokeWidth={2.5} />
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <Share2 size={15} strokeWidth={2.5} />
            <span>{shareLabel}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className={styles.shareWrapper}>
      <button
        className={`${styles.shareBtn} ${pillButton}`}
        onClick={share}
        title={shareLabel}
        aria-label={shareLabel}
        aria-live="polite"
      >
        {copied ? (
          <Check size={18} strokeWidth={2.5} />
        ) : (
          <Share2 size={18} strokeWidth={2.5} />
        )}
      </button>

      {copied && (
        <div className={styles.toast} role="status" aria-atomic="true">
          {copiedLabel}
        </div>
      )}
    </div>
  );
}
