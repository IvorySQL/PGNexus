"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "zh";

interface TranslationObject {
  en: string;
  zh: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // Overloaded function signatures for flexible usage
  t(translation: TranslationObject): string;
  t(en: string, zh: string): string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load saved language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "zh") {
      setLanguageState(saved);
    }
  }, []);

  // Save language preference to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Translation helper function with overloaded support
  // Supports both: t({ en: "Hello", zh: "你好" }) and t("Hello", "你好")
  const t = (enOrTranslation: string | TranslationObject, zh?: string): string => {
    if (typeof enOrTranslation === "object") {
      // New format: t({ en: "Hello", zh: "你好" })
      return language === "zh" ? enOrTranslation.zh : enOrTranslation.en;
    } else {
      // Old format: t("Hello", "你好")
      return language === "zh" ? (zh || enOrTranslation) : enOrTranslation;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
