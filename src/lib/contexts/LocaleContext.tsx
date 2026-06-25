"use client";

import React, { createContext, useContext, useTransition } from "react";

import { getLabels } from "@/lib/data/labels";
import type { Language } from "@/lib/utils/language";

interface LocaleContextType {
  locale: Language;
  labels: ReturnType<typeof getLabels>;
  setLocale: (newLocale: Language) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Language;
}) {
  const [locale, setLocaleState] = React.useState<Language>(initialLocale);
  const [, startTransition] = useTransition();

  const setLocale = async (newLocale: Language) => {
    try {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
      if (res.ok) {
        startTransition(() => {
          setLocaleState(newLocale);
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Failed to change locale:", error);
    }
  };

  const labels = getLabels(locale);

  return (
    <LocaleContext.Provider value={{ locale, labels, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
