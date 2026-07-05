"use client";

import React, { createContext, useContext } from "react";

import { getLabels } from "@/lib/data/labels";
import { getLocalizedPathname, type Language } from "@/lib/utils/language";

interface LocaleContextType {
  locale: Language;
  labels: ReturnType<typeof getLabels>;
  setLocale: (newLocale: Language) => void;
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

  const setLocale = (newLocale: Language) => {
    setLocaleState(newLocale);
    const currentPathname = window.location.pathname;
    const nextPathname = getLocalizedPathname(currentPathname, newLocale);

    if (nextPathname === currentPathname) return;

    window.location.assign(`${nextPathname}${window.location.search}${window.location.hash}`);
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
