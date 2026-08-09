import { expect, test } from '@playwright/test'

const locales = [
  { locale: 'zh-CN', baseUrl: '/' },
  { locale: 'en', baseUrl: '/en/' },
  { locale: 'ja', baseUrl: '/ja/' },
  { locale: 'zh-TW', baseUrl: '/zh-TW/' },
  { locale: 'zh-HK', baseUrl: '/zh-HK/' },
] as const

const routes = ['', 'docs', 'models'] as const

test.describe('Localized site navigation', () => {
  test('every locale serves representative routes', async ({ request }) => {
    for (const { locale, baseUrl } of locales) {
      for (const route of routes) {
        const response = await request.get(`${baseUrl}${route}`)
        expect(response.ok(), `${locale} should serve ${baseUrl}${route}`).toBe(true)
      }
    }
  })

  test('language switching keeps the current route and persists the choice', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop locale dropdown is used for this navigation check')

    await page.goto('/models')
    await page.getByRole('button', { name: '简体中文' }).click()

    const englishLink = page.locator('a[lang="en"]', { hasText: 'English' })
    await expect(englishLink).toHaveAttribute('href', /\/en\/models\/?$/)
    await englishLink.click()

    await expect(page).toHaveURL(/\/en\/models\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('mastra-preferred-locale'))).toBe('en')

    await page.goto('/')
    await expect(page).toHaveURL(/\/en\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})
