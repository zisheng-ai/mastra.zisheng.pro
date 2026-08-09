import { cn } from '@site/src/lib/utils'
import type { LessonStatus } from '../types'
import { useLocalizedLearnContent } from '../localization'

type LessonStatusChipProps = {
  status: LessonStatus
  module?: string
  className?: string
}

export function LessonStatusChip({ status, module, className }: LessonStatusChipProps) {
  const { isSimplifiedChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  if (status === 'published') return null

  const label = isSimplifiedChinese
    ? module === '生产环境'
      ? '即将推出'
      : '下周推出'
    : isHongKongChinese
      ? module === '生產環境'
        ? '即將推出'
        : '下星期推出'
      : isJapanese
        ? module === '本番環境'
          ? '近日公開'
          : '来週公開'
        : module === 'Production'
          ? 'Coming soon'
          : 'Coming next week'

  return (
    <span
      className={cn(
        'learn-status-coming-soon inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  )
}
