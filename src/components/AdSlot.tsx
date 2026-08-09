import { useEffect, useRef } from 'react'
import { cn } from '@site/src/lib/utils'

const ADSENSE_CLIENT = 'ca-pub-5641491107630454'
const ADSENSE_SCRIPT_ID = 'adsense-script'
const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSlotProps = {
  slot: string
  className?: string
}

export default function AdSlot({ slot, className }: AdSlotProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return

    initialized.current = true

    if (!document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = ADSENSE_SCRIPT_ID
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = ADSENSE_SCRIPT_SRC
      document.head.appendChild(script)
    }

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.warn('Unable to initialize AdSense ad slot.', error)
    }
  }, [])

  return (
    <div className={cn('my-8 min-h-[100px] w-full overflow-hidden', className)}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label="Advertisement"
      />
    </div>
  )
}
