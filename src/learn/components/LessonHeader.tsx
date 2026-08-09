import { useState } from 'react'
import { cn } from '@site/src/lib/utils'
import type { Lesson } from '../types'
import { LessonStatusChip } from './LessonStatusChip'
import { useLocalizedLearnContent } from '../localization'

type LessonHeaderProps = {
  lesson: Lesson
  lessonNumber: number
  totalLessons: number
  watched?: boolean
  onWatchedChange?: (checked: boolean) => void
  className?: string
}

export function LessonHeader({
  lesson,
  lessonNumber,
  totalLessons,
  watched,
  onWatchedChange,
  className,
}: LessonHeaderProps) {
  const { isSimplifiedChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  const [animating, setAnimating] = useState(false)

  return (
    <div className={cn('mb-6', className)}>
      <div className="mb-2 flex items-center gap-3">
        <span className="learn-meta-text text-sm">
          {isSimplifiedChinese
            ? `第 ${lessonNumber} 课，共 ${totalLessons} 课`
            : isHongKongChinese
              ? `第 ${lessonNumber} 課，共 ${totalLessons} 課`
              : isJapanese
                ? `レッスン ${lessonNumber}/${totalLessons}`
                : `Lesson ${lessonNumber} of ${totalLessons}`}
        </span>
        <span className="learn-meta-text">·</span>
        <span className="learn-meta-text text-sm">
          {lesson.durationMin} {isSimplifiedChinese ? '分钟' : isHongKongChinese ? '分鐘' : isJapanese ? '分' : 'min'}
        </span>
        {lesson.status === 'comingSoon' && (
          <>
            <span className="learn-meta-text">·</span>
            <LessonStatusChip status={lesson.status} module={lesson.module} />
          </>
        )}
        {onWatchedChange != null && (
          <label className="ml-auto flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={watched ?? false}
              onChange={e => {
                setAnimating(true)
                onWatchedChange(e.target.checked)
              }}
              className="sr-only"
            />
            <span className="learn-meta-text text-sm">
              {watched
                ? isSimplifiedChinese
                  ? '已完成'
                  : isHongKongChinese
                    ? '已完成'
                    : isJapanese
                      ? '完了'
                      : 'Complete'
                : isSimplifiedChinese
                  ? '标记为已完成'
                  : isHongKongChinese
                    ? '標記為已完成'
                    : isJapanese
                      ? '完了としてマーク'
                      : 'Mark as complete'}
            </span>
            <span
              className={cn('learn-watched-icon', watched && 'is-watched', animating && 'is-animate')}
              onAnimationEnd={() => setAnimating(false)}
            >
              {watched && '✓'}
            </span>
          </label>
        )}
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-(--mastra-text-primary)">{lesson.title}</h1>
    </div>
  )
}
