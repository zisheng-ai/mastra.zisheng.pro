import { useMemo } from 'react'
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import type { Lesson } from '../types'
import { useLocalizedLearnContent } from '../localization'
import { useSharedLearnStorage } from '../hooks/LearnStorageContext'
import { LearnLayout } from '../components/LearnLayout'

import { LessonListItem } from '../components/LessonListItem'
import { CourseSignupCTA } from '../components/CourseSignupCTA'

function useModules(lessons: Lesson[]) {
  return useMemo(() => {
    const map = new Map<string, { lesson: Lesson; globalIndex: number }[]>()
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      const group = map.get(lesson.module) ?? []
      group.push({ lesson, globalIndex: i })
      map.set(lesson.module, group)
    }
    return Array.from(map.entries())
  }, [lessons])
}

function LandingContent() {
  const { course, isSimplifiedChinese, isTaiwanChinese, isHongKongChinese, isJapanese, isLocalized } =
    useLocalizedLearnContent()
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const { storage } = useSharedLearnStorage()
  const modules = useModules(course.lessons)
  const pageUrl = new URL(location.pathname, siteConfig.url).toString()
  const ogImageUrl = new URL('/img/og-image.png', siteConfig.url).toString()

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${course.title} - ${isSimplifiedChinese ? '免费完整课程' : isTaiwanChinese || isHongKongChinese ? '免費完整課程' : isJapanese ? '無料フルコース' : 'Free Full Course'}`}
        />
        <meta property="og:description" content={course.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: course.title,
            description: course.description,
            url: pageUrl,
            provider: {
              '@type': 'Organization',
              name: 'Mastra Documentation Community',
              url: siteConfig.url,
            },
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: 0,
              priceCurrency: 'USD',
              category: 'Free',
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              courseWorkload: 'PT90M',
            },
          })}
        </script>
      </Head>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-(--mastra-text-primary)">
          {isLocalized ? course.title : course.title.replace('AI ', '')}
        </h1>
        {course.description.split('\n\n').map((para, i) => (
          <p key={i} className="mt-2 text-(--mastra-text-tertiary)">
            {para}
          </p>
        ))}
        <p className="mt-2 text-(--mastra-text-tertiary)">
          <Link to="/learn/what-is-an-agent" className="text-[#027930] hover:underline">
            {isSimplifiedChinese
              ? '前往第一课'
              : isTaiwanChinese || isHongKongChinese
                ? '前往第一課'
                : isJapanese
                  ? '最初のレッスンへ'
                  : 'Head to the first lesson'}
          </Link>{' '}
          {isSimplifiedChinese
            ? '，跟随 Guil 开始构建。'
            : isTaiwanChinese
              ? '，跟著 Guil 開始建立。'
              : isHongKongChinese
                ? '，跟隨 Guil 開始建立。'
                : isJapanese
                  ? '進み、Guil と一緒に構築を始めましょう。'
                  : 'to start building with Guil.'}
        </p>
      </div>

      {/* Lesson list grouped by module */}
      <div className="flex flex-col gap-8">
        {modules.map(([moduleName, moduleLessons]) => (
          <div key={moduleName}>
            <h3 className="mb-3 text-sm font-semibold text-(--mastra-text-tertiary)">{moduleName}</h3>
            <div className="flex flex-col gap-2">
              {moduleLessons.map(({ lesson, globalIndex }) => (
                <LessonListItem key={lesson.slug} lesson={lesson} index={globalIndex} storage={storage} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <CourseSignupCTA className="mt-10" />
    </>
  )
}

export default function LearnLandingPage() {
  const { course } = useLocalizedLearnContent()
  const { siteConfig } = useDocusaurusContext()
  const ogImageUrl = new URL('/img/og-image.png', siteConfig.url).toString()
  return (
    <LearnLayout title={course.title} description={course.description} image={ogImageUrl}>
      <LandingContent />
    </LearnLayout>
  )
}
