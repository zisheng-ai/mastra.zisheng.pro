import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useEffect } from 'react'

const STORAGE_KEY = 'mastra-preferred-locale'

function joinLocalePath(baseUrl: string, pathname: string): string {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const pathnameSuffix = pathname.replace(/^\/+/, '')
  return `${normalizedBaseUrl}${pathnameSuffix}`
}

export function LocalePreference() {
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext()

  useEffect(() => {
    const localeByHtmlLang = new Map(Object.entries(localeConfigs).map(([locale, config]) => [config.htmlLang, locale]))

    const persistLocaleLink = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const localeLink = target.closest<HTMLAnchorElement>('a[lang]')
      const locale = localeLink ? localeByHtmlLang.get(localeLink.lang) : undefined
      if (!locale) return

      try {
        window.localStorage.setItem(STORAGE_KEY, locale)
      } catch {
        // Browsing modes that disable storage should still allow navigation.
      }
    }

    document.addEventListener('click', persistLocaleLink, true)

    try {
      const rootLocale = Object.entries(localeConfigs).find(([, config]) => config.baseUrl === '/')?.[0]
      const storedLocale = window.localStorage.getItem(STORAGE_KEY)

      if (!storedLocale || !localeConfigs[storedLocale]) {
        window.localStorage.setItem(STORAGE_KEY, currentLocale)
      } else if (currentLocale !== rootLocale) {
        // An explicit locale URL always wins over an older saved preference.
        window.localStorage.setItem(STORAGE_KEY, currentLocale)
      } else if (storedLocale !== currentLocale && process.env.NODE_ENV === 'production') {
        const targetPath = joinLocalePath(localeConfigs[storedLocale].baseUrl, window.location.pathname)
        window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`)
      }
    } catch {
      // Locale URLs remain the source of truth when storage is unavailable.
    }

    return () => document.removeEventListener('click', persistLocaleLink, true)
  }, [currentLocale, localeConfigs])

  return null
}
