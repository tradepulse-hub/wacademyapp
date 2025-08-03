"use client"

import { useMemo } from "react"

import type React from "react"
import { createContext, useState, useEffect, useCallback } from "react"

// Importar diretamente os arquivos JSON de tradução
// Certifique-se de que estes arquivos contêm APENAS o objeto JSON, sem 'export' ou outras sintaxes JS.
import enTranslations from "@/i18n/locales/en.json"
import esTranslations from "@/i18n/locales/es.json"
import idTranslations from "@/i18n/locales/id.json"
import jaTranslations from "@/i18n/locales/ja.json"

// Mapeamento dos imports para os locales
const dictionaries: { [key: string]: { [key: string]: string } } = {
  en: enTranslations,
  es: esTranslations,
  id: idTranslations,
  ja: jaTranslations,
}

// Define o tipo para as traduções
type Translations = { [key: string]: string }

// Define o contexto para i18n e o exporta
interface I18nContextType {
  locale: string
  setLocale: (newLocale: string) => void
  t: (key: string, params?: { [key: string]: string | number }) => string
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en") // Default to English
  const [translations, setTranslations] = useState<Translations>(enTranslations) // Inicia com as traduções em inglês

  // Carrega a linguagem do localStorage na montagem
  useEffect(() => {
    const storedLanguage = localStorage.getItem("worldAcademyLanguage")
    if (storedLanguage && dictionaries[storedLanguage]) {
      setLocaleState(storedLanguage.toLowerCase())
      setTranslations(dictionaries[storedLanguage]) // Define as traduções iniciais com base no localStorage
    }
  }, [])

  // Atualiza as traduções quando o locale muda
  useEffect(() => {
    if (dictionaries[locale]) {
      setTranslations(dictionaries[locale])
    } else {
      console.warn(`Translations for locale '${locale}' not found. Falling back to 'en'.`)
      setLocaleState("en")
      setTranslations(enTranslations)
    }
  }, [locale])

  // Função de tradução
  const t = useCallback(
    (key: string, params?: { [key: string]: string | number }) => {
      let translatedText = translations[key] || key // Fallback to key if not found

      if (params) {
        for (const paramKey in params) {
          translatedText = translatedText.replace(new RegExp(`{{${paramKey}}}`, "g"), String(params[paramKey]))
        }
      }
      return translatedText
    },
    [translations],
  )

  const setLocale = useCallback((newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem("worldAcademyLanguage", newLocale)
  }, [])

  const contextValue = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}
