import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { CookieConsent } from '@site/src/components/cookie/cookie-consent'
import { DocsChatProvider, KapaChatProvider } from '@mastra/docusaurus-plugin-kapa/client'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'

export default function Root({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext()
  const posthogApiKey = siteConfig.customFields.posthogApiKey as string | undefined
  const posthogHost = (siteConfig.customFields.posthogHost as string) || 'https://us.i.posthog.com'

  const content = (
    <>
      <CookieConsent />
      <DocsChatProvider>
        <KapaChatProvider>{children}</KapaChatProvider>
      </DocsChatProvider>
    </>
  )

  if (!posthogApiKey) return content

  return (
    <PostHogProvider
      apiKey={posthogApiKey}
      options={{
        api_host: posthogHost,
      }}
    >
      {content}
    </PostHogProvider>
  )
}
