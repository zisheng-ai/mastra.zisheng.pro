import { useMemo } from 'react'
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
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
  const { course, isSimplifiedChinese, isHongKongChinese, isJapanese, isLocalized } =
    useLocalizedLearnContent()
  const { storage } = useSharedLearnStorage()
  const modules = useModules(course.lessons)

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`${course.title} - ${isSimplifiedChinese ? '免费完整课程' : isHongKongChinese ? '免費完整課程' : isJapanese ? '無料フルコース' : 'Free Full Course'}`}
        />
        <meta property="og:description" content={course.description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`https://mastra.ai/api/og/blog?title=${encodeURIComponent(course.title)}&author=${encodeURIComponent(isSimplifiedChinese ? '免费完整课程' : isHongKongChinese ? '免費完整課程' : isJapanese ? '無料フルコース' : 'Free Full Course')}`}
        />
        <meta name="author" content="Guil Hernandez" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: course.title,
            description: course.description,
            provider: {
              '@type': 'Organization',
              name: 'Mastra',
              url: 'https://mastra.ai',
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
              instructor: {
                '@type': 'Person',
                name: 'Guil Hernandez',
                url: 'https://www.linkedin.com/in/guiljh/',
                image: 'https://mastra.ai/img/guil-hernandez.jpg',
                jobTitle: 'Developer Educator',
                description: isSimplifiedChinese
                  ? '拥有十余年软件开发与教学经验，课程已服务超过 50 万名学习者。'
                  : isHongKongChinese
                    ? '具備超過十年建立和教授軟件的經驗，課程已有超過 50 萬名學員使用。'
                    : isJapanese
                      ? 'ソフトウェア開発と教育に 10 年以上携わり、50 万人を超える学習者にコースを提供。'
                      : 'Over a decade building and teaching software, with courses used by 500,000+ learners.',
              },
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
              : isHongKongChinese
                ? '前往第一課'
                : isJapanese
                  ? '最初のレッスンへ'
                  : 'Head to the first lesson'}
          </Link>{' '}
          {isSimplifiedChinese
            ? '，跟随 Guil 开始构建。'
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
  return (
    <LearnLayout title={course.title} description={course.description}>
      <LandingContent />
    </LearnLayout>
  )
}
