import { useState, useEffect, lazy, Suspense, useMemo } from 'react'
import { useLocation } from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Head from '@docusaurus/Head'
import MDXContent from '@theme/MDXContent'
import { cn } from '@site/src/lib/utils'
import { useLessonProgress } from '../hooks/useLessonProgress'
import { useLocalizedLearnContent } from '../localization'
import type { Lesson } from '../types'
import { LearnLayout } from '../components/LearnLayout'
import { LessonHeader } from '../components/LessonHeader'
import { LessonNav } from '../components/LessonNav'
import { YouTubePlayerWithResume } from '../components/YouTubePlayerWithResume'
import { CourseSignupCTA } from '../components/CourseSignupCTA'
import { getLessonIndex } from '../utils'

function PublishedContent({
  lesson,
  lessonNumber,
  totalLessons,
}: {
  lesson: Lesson
  lessonNumber: number
  totalLessons: number
}) {
  const { contentModules, isSimplifiedChinese, isTaiwanChinese, isHongKongChinese, isJapanese } =
    useLocalizedLearnContent()
  const { watched, seconds, setWatched, setSeconds, setLastVisited } = useLessonProgress(lesson.slug)

  useEffect(() => {
    setLastVisited(lesson.slug)
  }, [lesson.slug, setLastVisited])

  const MdxContent = useMemo(() => {
    const loader = contentModules[lesson.slug]
    if (!loader) return null
    return lazy(loader)
  }, [contentModules, lesson.slug])

  return (
    <>
      <LessonHeader
        lesson={lesson}
        lessonNumber={lessonNumber}
        totalLessons={totalLessons}
        watched={watched}
        onWatchedChange={setWatched}
      />
      {lesson.youtubeId && (
        <YouTubePlayerWithResume
          videoId={lesson.youtubeId}
          savedSeconds={seconds}
          onTimeUpdate={setSeconds}
          onAutoComplete={() => setWatched(true)}
        />
      )}
      {MdxContent && (
        <div className="markdown mt-6">
          <MDXContent>
            <Suspense
              fallback={
                <div className="py-4 text-(--mastra-text-tertiary)">
                  {isSimplifiedChinese
                    ? '正在加载内容……'
                    : isTaiwanChinese || isHongKongChinese
                      ? '正在載入內容……'
                      : isJapanese
                        ? 'コンテンツを読み込んでいます…'
                        : 'Loading content...'}
                </div>
              }
            >
              <MdxContent />
            </Suspense>
          </MDXContent>
        </div>
      )}
      <MarkAsCompleteButton
        watched={watched}
        onToggle={() => setWatched(!watched)}
        isSimplifiedChinese={isSimplifiedChinese}
        isTaiwanChinese={isTaiwanChinese}
        isHongKongChinese={isHongKongChinese}
        isJapanese={isJapanese}
        className="mt-8"
      />
      <CourseSignupCTA className="mt-8" />
    </>
  )
}

function MarkAsCompleteButton({
  watched,
  onToggle,
  isSimplifiedChinese,
  isTaiwanChinese,
  isHongKongChinese,
  isJapanese,
  className,
}: {
  watched: boolean
  onToggle: () => void
  isSimplifiedChinese: boolean
  isTaiwanChinese: boolean
  isHongKongChinese: boolean
  isJapanese: boolean
  className?: string
}) {
  const [animating, setAnimating] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        setAnimating(true)
        onToggle()
      }}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
        watched
          ? 'learn-complete-button-done border-(--mastra-green-accent-3) text-(--mastra-green-accent-3) dark:border-(--mastra-green-accent-2) dark:text-(--mastra-green-accent-2)'
          : 'border-(--border) text-(--mastra-text-secondary) hover:border-(--mastra-green-accent-3) hover:text-(--mastra-text-primary)',
        className,
      )}
    >
      <span
        className={cn('learn-watched-icon', watched && 'is-watched', animating && 'is-animate')}
        onAnimationEnd={() => setAnimating(false)}
      >
        {watched && '✓'}
      </span>
      {watched
        ? isSimplifiedChinese
          ? '已完成'
          : isTaiwanChinese || isHongKongChinese
            ? '已完成'
            : isJapanese
              ? '完了'
              : 'Completed'
        : isSimplifiedChinese
          ? '将本课标记为已完成'
          : isTaiwanChinese || isHongKongChinese
            ? '將本課標記為已完成'
            : isJapanese
              ? 'このレッスンを完了としてマーク'
              : 'Mark lesson as complete'}
    </button>
  )
}

export default function LessonPage() {
  const { course, isSimplifiedChinese, isTaiwanChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const learnBasePath = useBaseUrl('/learn/')
  const slug = location.pathname.startsWith(learnBasePath)
    ? location.pathname.slice(learnBasePath.length).replace(/\/$/, '')
    : ''
  const lessonIndex = getLessonIndex(course.lessons, slug)

  if (lessonIndex === -1) return null

  const lesson = course.lessons[lessonIndex]
  const prev = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : undefined
  const next = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : undefined

  const seoTitle = lesson.seo?.title ?? `${lesson.title} | Mastra`
  const seoDescription = lesson.seo?.description ?? lesson.preview.intro

  const pageUrl = new URL(location.pathname, siteConfig.url).toString()
  const ogImageUrl = new URL('/img/og-image.png', siteConfig.url).toString()

  return (
    <LearnLayout title={seoTitle} description={seoDescription} image={ogImageUrl}>
      <Head>
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={pageUrl} />
        {lesson.youtubeId && (
          <>
            <meta property="og:type" content="video.other" />
            <meta property="og:video" content={`https://www.youtube.com/embed/${lesson.youtubeId}`} />
            <script type="application/ld+json">
              {JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'VideoObject',
                name: lesson.title,
                description: seoDescription,
                thumbnailUrl: ogImageUrl,
                uploadDate: lesson.publishedDate,
                embedUrl: `https://www.youtube.com/embed/${lesson.youtubeId}`,
                contentUrl: `https://www.youtube.com/watch?v=${lesson.youtubeId}`,
                duration: `PT${lesson.durationMin}M`,
                publisher: {
                  '@type': 'Organization',
                  name: 'Mastra Documentation Community',
                  url: siteConfig.url,
                },
                url: pageUrl,
              })}
            </script>
          </>
        )}
      </Head>

      <PublishedContent lesson={lesson} lessonNumber={lessonIndex + 1} totalLessons={course.lessons.length} />

      <LessonNav prev={prev} next={next} className="mt-8 border-t border-t-(--border)" />
    </LearnLayout>
  )
}
