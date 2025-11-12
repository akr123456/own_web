'use client'

import { clsxm } from '@zolplay/utils'
import React from 'react'

export function BackgroundOverlays() {
  const [isAtBottom, setIsAtBottom] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2
    setIsAtBottom((prev) => (prev === atBottom ? prev : atBottom))
  }, [])

  React.useEffect(() => {
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none" />

      <div
        className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] opacity-100 transition-opacity duration-200 dark:opacity-0"
        style={{ willChange: 'opacity' }}
      >
        <span
          className={clsxm(
            'absolute bottom-0 left-0 h-1 w-full rounded-full bg-gradient-to-r from-zinc-400 via-yellow-300 to-yellow-400 opacity-0 transition-all duration-300 ease-out',
            isAtBottom ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-2',
            'dark:opacity-0 dark:translate-y-2'
          )}
        />
      </div>

      <div
        className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_100%)] opacity-0 transition-opacity duration-200 dark:opacity-100"
        style={{ willChange: 'opacity' }}
      >
        <span
          className={clsxm(
            'absolute bottom-0 left-0 h-1 w-full rounded-full bg-gradient-to-r from-zinc-600 via-amber-400 to-yellow-200 opacity-0 transition-all duration-300 ease-out',
            isAtBottom
              ? 'dark:opacity-80 dark:translate-y-0'
              : 'dark:opacity-0 dark:translate-y-2',
            'opacity-0 translate-y-2'
          )}
        />
      </div>
    </>
  )
}


