import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

// Read persisted language or default to Arabic
const savedLanguage = localStorage.getItem('gp_lang') || 'ar'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // react already escapes values
    },
  })

// Function to synchronize HTML document direction and lang attributes
export function syncLanguageAttributes(lang: string) {
  document.documentElement.lang = lang
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  localStorage.setItem('gp_lang', lang)
}

// Initial sync
syncLanguageAttributes(i18n.language)

// Listen to language changes to keep HTML attributes synchronized automatically
i18n.on('languageChanged', (lng) => {
  syncLanguageAttributes(lng)
})

export default i18n
