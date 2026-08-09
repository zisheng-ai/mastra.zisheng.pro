import { useEffect, useRef, useState } from 'react'
import { cn } from '@site/src/lib/utils'

type AdSize = [number, number] | 'fluid'

type AdxSlotProps = {
  path: string
  id: string
  sizes: AdSize[]
  className?: string
  priority?: boolean
}

type AdState = 'pending' | 'filled' | 'empty'

type AdManagerSlot = {
  addService: (service: unknown) => void
  getSlotElementId: () => string
}

declare global {
  interface Window {
    // Google Publisher Tag is provided by the external GPT script.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    googletag: any
  }
}

export default function AdxSlot({ path, id, sizes, className, priority = false }: AdxSlotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [adState, setAdState] = useState<AdState>('pending')

  useEffect(() => {
    window.googletag = window.googletag || { cmd: [] }
    let observer: IntersectionObserver | null = null
    let disposed = false
    let slot: AdManagerSlot | null = null
    let slotRenderEnded: ((event: { isEmpty: boolean; slot: AdManagerSlot }) => void) | null = null

    function defineAndDisplay() {
      window.googletag.cmd.push(() => {
        if (disposed) return

        const pubads = window.googletag.pubads()
        slotRenderEnded = event => {
          if (event.slot.getSlotElementId() !== id || disposed) return
          setAdState(event.isEmpty ? 'empty' : 'filled')
        }
        pubads.addEventListener('slotRenderEnded', slotRenderEnded)

        slot = window.googletag.defineSlot(path, sizes, id)
        if (!slot) {
          setAdState('empty')
          return
        }

        slot.addService(pubads)
        window.googletag.display(id)
      })
    }

    if (priority) {
      defineAndDisplay()
    } else {
      observer = new IntersectionObserver(
        entries => {
          if (!entries[0]?.isIntersecting) return

          observer?.disconnect()
          defineAndDisplay()
        },
        { rootMargin: '200px' },
      )

      if (wrapperRef.current) observer.observe(wrapperRef.current)
    }

    return () => {
      disposed = true
      observer?.disconnect()
      window.googletag?.cmd.push(() => {
        const pubads = window.googletag.pubads()
        if (slotRenderEnded) pubads.removeEventListener('slotRenderEnded', slotRenderEnded)

        if (slot) window.googletag.destroySlots([slot])
      })
    }
  }, [id, path, priority])

  const isFluid = sizes.includes('fluid')
  const wrapperStyle =
    adState === 'empty'
      ? ({ display: 'none' } as const)
      : adState === 'pending'
        ? ({ height: 1, marginBottom: 0, marginTop: 0 } as const)
        : undefined

  return (
    <div
      ref={wrapperRef}
      className={cn(
        isFluid ? 'w-full' : 'flex justify-center',
        'overflow-hidden',
        adState === 'filled' && 'my-8',
        className,
      )}
      style={wrapperStyle}
      data-ad-state={adState}
      aria-hidden={adState !== 'filled'}
    >
      <div id={id} style={isFluid ? { width: '100%' } : { minWidth: 250, minHeight: 250 }} aria-label="Advertisement" />
    </div>
  )
}
