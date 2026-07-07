"use client";

import React from "react";
import Link from "next/link";

import { useLocale } from "@/lib/contexts/LocaleContext";

import styles from "./Footer.module.css";

export default function Footer() {
  const { locale, labels } = useLocale();
  const privacyHref = locale === 'en' ? '/en/privacy' : '/privacy';

  return (
    <footer className={styles.wrapper}>
      <Link href={privacyHref} className={styles.link}>
        {labels.privacyPolicy}
      </Link>
    </footer>
  );
}
