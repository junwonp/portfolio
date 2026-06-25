"use client";

import React from "react";

import { useLocale } from "@/lib/contexts/LocaleContext";

import styles from "./Footer.module.css";
import ShareButton from "./ShareButton";

export default function Footer() {
  const { labels } = useLocale();

  return (
    <footer className={styles.wrapper}>
      <ShareButton
        variant="text"
        shareLabel={labels.shareFooter}
        copiedLabel={labels.linkCopied}
      />
    </footer>
  );
}
