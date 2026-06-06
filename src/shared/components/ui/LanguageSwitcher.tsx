import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleToggle = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(nextLang)
  }

  const label = i18n.language === 'ar' ? 'English' : 'العربية'

  return (
    <button
      onClick={handleToggle}
      style={{
        background: 'rgba(59,130,246,.08)',
        border: '1px solid rgba(59,130,246,.25)',
        color: 'var(--text)',
        borderRadius: 8,
        padding: '.35rem .75rem',
        fontSize: '.75rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all .2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '.35rem',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget
        target.style.background = 'rgba(59,130,246,.15)'
        target.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget
        target.style.background = 'rgba(59,130,246,.08)'
        target.style.borderColor = 'rgba(59,130,246,.25)'
      }}
      aria-label="تغيير اللغة / Switch Language"
    >
      🌐 {label}
    </button>
  )
}
