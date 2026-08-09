import ErrorBoundary from '@docusaurus/ErrorBoundary'
import Head from '@docusaurus/Head'
import { PageMetadata, SkipToContentFallbackId, ThemeClassNames } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import AnnouncementBar from '@theme/AnnouncementBar'
import ErrorPageContent from '@theme/ErrorPageContent'
import Footer from '@theme/Footer'
import type { Props } from '@theme/Layout'
import LayoutProvider from '@theme/Layout/Provider'
import Navbar from '@theme/Navbar'
import SkipToContent from '@theme/SkipToContent'
import clsx from 'clsx'
import { type ReactNode } from 'react'
import styles from './styles.module.css'

export default function Layout(props: Props): ReactNode {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props

  const location = useLocation()
  const { siteConfig } = useDocusaurusContext()
  const canonicalUrl = new URL(location.pathname, siteConfig.url).toString()
  const isNotFoundPage = /(?:^|\/)404(?:\.html)?\/?$/.test(location.pathname)
  const socialTitle = title
    ? title.endsWith(siteConfig.title)
      ? title
      : `${title} | ${siteConfig.title}`
    : siteConfig.title

  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.title} />
        <meta property="og:image:alt" content={socialTitle} />
        <meta name="twitter:title" content={socialTitle} />
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image:alt" content={socialTitle} />
        {isNotFoundPage && <meta name="robots" content="noindex" />}
      </Head>

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.layout.main.container,
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName,
        )}
      >
        <ErrorBoundary fallback={params => <ErrorPageContent {...params} />}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProvider>
  )
}
