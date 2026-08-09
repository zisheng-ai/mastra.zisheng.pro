import { cn } from '@site/src/lib/utils'
import { useLocalizedLearnContent } from '../localization'

type LearnProgressBarProps = {
  completed: number
  total: number
  className?: string
}

export function LearnProgressBar({ completed, total, className }: LearnProgressBarProps) {
  const { isSimplifiedChinese, isTaiwanChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  const pct = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-(--mastra-surface-3)">
        <div className="learn-progress-completed absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs whitespace-nowrap text-(--mastra-text-tertiary)">
        {isSimplifiedChinese
          ? `已完成 ${completed}/${total}`
          : isTaiwanChinese || isHongKongChinese
            ? `已完成 ${completed}/${total}`
            : isJapanese
              ? `${completed}/${total} 完了`
              : `${completed} of ${total} completed`}
      </span>
    </div>
  )
}
