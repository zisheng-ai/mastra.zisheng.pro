import { useEffect, useRef, useState } from 'react'
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

type AdState = 'pending' | 'filled' | 'empty'

export default function AdSlot({ slot, className }: AdSlotProps) {
  const initialized = useRef(false)
  const adRef = useRef<HTMLElement>(null)
  const [adState, setAdState] = useState<AdState>('pending')

  useEffect(() => {
    const ad = adRef.current
    const observer = new MutationObserver(() => {
      const status = ad?.dataset.adStatus
      if (status === 'filled') setAdState('filled')
      if (status === 'unfilled') setAdState('empty')
    })

    if (ad) {
      observer.observe(ad, {
        attributes: true,
        attributeFilter: ['data-ad-status'],
      })
    }

    return () => observer.disconnect()
  }, [])

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

  const wrapperStyle =
    adState === 'empty'
      ? ({ display: 'none' } as const)
      : adState === 'pending'
        ? ({ height: 1, marginBottom: 0, marginTop: 0 } as const)
        : undefined

  return (
    <div
      className={cn('w-full overflow-hidden', adState === 'filled' && 'my-8', className)}
      style={wrapperStyle}
      data-ad-state={adState}
      aria-hidden={adState !== 'filled'}
    >
      <ins
        ref={adRef}
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
