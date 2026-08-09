import { useState, useEffect } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { cn } from '@site/src/lib/utils'
import { Button } from '@site/src/components/ui/button'
import { Input } from '@site/src/components/ui/input'
import { useLocalizedLearnContent } from '../localization'

const SUBSCRIBED_KEY = 'mastraLearn:subscribed'

type CourseSignupCTAProps = {
  className?: string
}

export function CourseSignupCTA({ className }: CourseSignupCTAProps) {
  const { course, isSimplifiedChinese, isTaiwanChinese, isHongKongChinese, isJapanese } = useLocalizedLearnContent()
  const allPublished = course.lessons.every(l => l.status === 'published')
  const { siteConfig } = useDocusaurusContext()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIBED_KEY) === 'true') {
      setSubmitted(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return

    const portalId = siteConfig.customFields?.hsPortalId as string
    const formGuid = siteConfig.customFields?.hsFormGuidLearn as string

    if (!portalId || !formGuid) {
      setError(
        isSimplifiedChinese
          ? '订阅功能尚未配置。'
          : isTaiwanChinese || isHongKongChinese
            ? '訂閱功能尚未設定。'
            : isJapanese
              ? '登録機能はまだ設定されていません。'
              : 'Signup is not configured yet.',
      )
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [{ name: 'email', value: email }],
          context: { pageName: 'Mastra Learn - Course Signup', pageUri: window.location.href },
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      localStorage.setItem(SUBSCRIBED_KEY, 'true')
    } catch {
      setError(
        isSimplifiedChinese
          ? '出现问题，请重试。'
          : isTaiwanChinese || isHongKongChinese
            ? '發生問題，請再試一次。'
            : isJapanese
              ? 'エラーが発生しました。もう一度お試しください。'
              : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (allPublished) return null

  if (submitted) {
    return (
      <div id="learn-signup-cta" className={cn('learn-subscribed rounded-lg border p-6 text-center', className)}>
        <p className="text-lg font-medium text-(--mastra-text-primary)">
          {isSimplifiedChinese
            ? '订阅成功！'
            : isTaiwanChinese || isHongKongChinese
              ? '訂閱成功！'
              : isJapanese
                ? '登録が完了しました！'
                : 'You signed up!'}
        </p>
        <p className="mt-1 text-sm text-(--mastra-text-tertiary)">
          {isSimplifiedChinese
            ? '新课程发布时，我们会通过邮件通知你。'
            : isTaiwanChinese
              ? '新課程發布時，我們會透過電子郵件通知你。'
              : isHongKongChinese
                ? '新課程發佈時，我們會透過電郵通知你。'
                : isJapanese
                  ? '新しいレッスンが公開されたらメールでお知らせします。'
                  : "We'll email you when new lessons are published."}
        </p>
      </div>
    )
  }

  return (
    <div id="learn-signup-cta" className={cn('rounded-lg border border-(--border) p-6 text-center', className)}>
      <h3 className="text-lg font-semibold text-(--mastra-text-primary)">
        {isSimplifiedChinese
          ? '不错过接下来的 Mastra 课程'
          : isTaiwanChinese
            ? '別錯過接下來的 Mastra 課程'
            : isHongKongChinese
              ? '不要錯過接下來的 Mastra 課程'
              : isJapanese
                ? 'Mastra の次のレッスンをお見逃しなく'
                : 'Don’t miss the next Mastra lessons'}
      </h3>
      <p className="mt-1 mb-4 text-sm text-(--mastra-text-tertiary)">
        {isSimplifiedChinese
          ? '新课程发布后立即获得通知，及时了解每次更新。我们会向你发送课程改进、Mastra 新功能和即将举办的线上研讨会信息，你可以随时取消订阅。'
          : isTaiwanChinese
            ? '新課程發布時立即收到通知，掌握每次更新。我們會透過電子郵件通知你課程改進、Mastra 新功能和即將舉辦的線上工作坊。你可以隨時取消訂閱。'
            : isHongKongChinese
              ? '新課程發佈時立即收到通知，掌握每次更新。我們會透過電郵通知你課程改進、Mastra 新功能和即將舉行的網上工作坊。你可以隨時取消訂閱。'
              : isJapanese
                ? '新しいレッスンの公開時にすぐ通知を受け取り、更新情報を確認できます。コースの改善、Mastra の新機能、今後のライブワークショップについてメールでお知らせします。いつでも登録を解除できます。'
                : 'Be notified the moment new lessons release and stay ahead of every update. We’ll email you about course improvements, new Mastra features, and upcoming live workshops. Unsubscribe anytime.'}
      </p>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
        <Input
          type="email"
          placeholder={
            isSimplifiedChinese
              ? '输入邮箱地址'
              : isTaiwanChinese
                ? '輸入電子郵件地址'
                : isHongKongChinese
                  ? '輸入電郵地址'
                  : isJapanese
                    ? 'メールアドレスを入力'
                    : 'Enter your email'
          }
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={submitting} size="default">
          {submitting
            ? isSimplifiedChinese
              ? '正在订阅……'
              : isTaiwanChinese || isHongKongChinese
                ? '正在訂閱……'
                : isJapanese
                  ? '登録中…'
                  : 'Signing you up...'
            : isSimplifiedChinese
              ? '获取通知'
              : isTaiwanChinese || isHongKongChinese
                ? '接收通知'
                : isJapanese
                  ? '通知を受け取る'
                  : 'Get notified'}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
