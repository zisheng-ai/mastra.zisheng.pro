import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import type { Lesson, LearnStorageV1 } from '../types'
import { formatSeconds } from '../utils'
import { useLocalizedLearnContent } from '../localization'

type ContinueCardProps = {
  storage: LearnStorageV1
  lessons: Lesson[]
  className?: string
}

export function ContinueCard({ storage, lessons, className }: ContinueCardProps) {
  const { isSimplifiedChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  // Find the first published lesson the user hasn't watched yet
  const nextLesson = lessons.find(l => l.status === 'published' && !storage.lessons[l.slug]?.watched)
  if (!nextLesson) return null

  const slug = nextLesson.slug
  const lesson = nextLesson
  const progress = storage.lessons[slug]
  const hasTimestamp = progress && progress.seconds > 10

  return (
    <Link
      to={`/learn/${slug}`}
      className={cn(
        'learn-link flex items-center justify-between rounded-lg border border-(--border) p-4 transition-colors hover:border-(--mastra-green-accent-3) dark:hover:border-(--mastra-green-accent)',
        className,
      )}
    >
      <div>
        <p className="text-xs font-medium tracking-wide text-(--mastra-text-tertiary) uppercase">
          {isSimplifiedChinese
            ? '继续学习'
            : isHongKongChinese
              ? '繼續學習'
              : isJapanese
                ? '学習を続ける'
                : 'Continue learning'}
        </p>
        <p className="mt-1 text-base font-medium text-(--mastra-text-primary)">{lesson.title}</p>
        {hasTimestamp && (
          <p className="mt-0.5 text-sm text-(--mastra-text-tertiary)">
            {isSimplifiedChinese
              ? '从此处继续播放：'
              : isHongKongChinese
                ? '由這裏繼續播放：'
                : isJapanese
                  ? '動画を再開：'
                  : 'Resume video at '}
            {formatSeconds(progress.seconds)}
          </p>
        )}
      </div>
      <span className="text-2xl text-(--mastra-text-tertiary)">→</span>
    </Link>
  )
}
