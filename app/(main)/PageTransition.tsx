'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import ArrowIcon from '~/assets/ArrowIcon'
import { navigationItems } from '~/config/nav'

export default function PageTransition() {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const duration = 2000 // ms, 可调整

  useEffect(() => {
    if (!prevPathRef.current) {
      prevPathRef.current = pathname
      return
    }

    const prev = prevPathRef.current
    if (prev === pathname) return

    const findIndexFor = (p: string) => {
      const idx = navigationItems.findIndex((i) => i.href === p)
      if (idx !== -1) return idx
      return navigationItems.findIndex((i) => p.startsWith(i.href) && i.href !== '/')
    }

    const prevIndex = findIndexFor(prev)
    const nextIndex = findIndexFor(pathname)

    let dir: 'ltr' | 'rtl' = 'ltr'
    if (prevIndex !== -1 && nextIndex !== -1) {
      dir = nextIndex > prevIndex ? 'ltr' : 'rtl'
    } else if (prev === '/' && pathname !== '/') {
      dir = 'ltr'
    } else if (pathname === '/' && prev !== '/') {
      dir = 'rtl'
    }

    setDirection(dir)
    setAnimating(true)

    const t = window.setTimeout(() => {
      setAnimating(false)
    }, duration)

    prevPathRef.current = pathname

    return () => window.clearTimeout(t)
  }, [pathname])

  if (!animating) return null

  const overlayStyle = { '--pt-duration': `${duration}ms` } as React.CSSProperties & Record<string, string>

  return (
    <div className="page-transition-overlay" aria-hidden style={overlayStyle}>
      <div className="pto-left" aria-hidden />
      <div className="pto-right" aria-hidden />

      <div className="page-transition-arrow-wrapper">
        <ArrowIcon
          className={direction === 'ltr' ? 'page-transition-arrow arrow-ltr' : 'page-transition-arrow arrow-rtl'}
          direction={direction}
          width={'80vw'}
          height={'auto'}
        />
      </div>
    </div>
  )
}
