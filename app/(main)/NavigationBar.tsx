'use client'

import { clsxm } from '@zolplay/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { type IconProps } from '~/assets'
import { navigationItems } from '~/config/nav'

// Hook to detect scroll direction
export function useScrollDirection() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  React.useEffect(() => {
    let ticking = false

    const updateScroll = () => {
      const scrollY = window.scrollY

      // Show when at top or scrolling up
      if (scrollY === 0 || scrollY < lastScrollY) {
        setIsVisible(true)
      } else if (scrollY > lastScrollY + 10) {
        // Hide when scrolling down more than 10px
        setIsVisible(false)
      }

      setLastScrollY(scrollY)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return isVisible
}

function NavItem({
  href,
  icon: Icon,
  text,
}: {
  href: string
  icon: React.ComponentType<IconProps>
  text: string
}) {
  const isActive = usePathname() === href

  return (
    <li className="relative">
      {/* 黄色书签背景 - 固定定位,完全遮挡背后的斜线 */}
      {isActive && (
        <div className="absolute -top-4 -bottom-3 -left-1 -right-1 rounded-lg pointer-events-none" style={{ 
          zIndex: 0, 
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.14)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='25' height='25' fill='%23FAEA00'/%3E%3Cpath d='M 0 0 Q 8 6 12 10 Q 16 14 18 19 Q 21 22 25 25' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1.3' stroke-linecap='round'/%3E%3Cpath d='M 0 15 Q 1 13 3 13 Q 7 15 10 24 Q 10.5 24.5 11 25' fill='none' stroke='rgba(0,0,0,0.12)' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '25px 25px',
          backgroundPosition: '0 100%',
          backgroundColor: '#FAEA00',
          backgroundRepeat: 'no-repeat',
        }} />
      )}
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-5 py-2 transition duration-200',
          isActive
            ? 'text-black dark:text-black'
            : 'text-white hover:text-gray-200'
        )}
        title={text}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <Icon className="h-6 w-6" style={{ filter: 'drop-shadow(0 2px 4px rgba(33, 33, 33, 0.5))' }} />
      </Link>
    </li>
  )
}

function Desktop({
  className,
}: {
  className?: string
}) {
  const isVisible = useScrollDirection()

  return (
    <motion.div
      className={clsxm(
        'fixed top-0 left-0 right-0 z-50 flex justify-center',
        className
      )}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <nav 
        className="py-2 relative backdrop-blur-md rounded-b-lg"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0, transparent 1.85px, rgba(54, 54, 54, 0.15) 1.5px, rgba(54, 54, 54, 0.15) 3px)',
          backgroundColor: 'rgba(179, 179, 179, 0)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <ul className="flex px-4">
          {navigationItems.map(({ href, text, icon }, index) => (
            <React.Fragment key={href}>
              <NavItem href={href} icon={icon} text={text} />
              {index < navigationItems.length - 1 && (
                <li className="flex items-center px-0.5">
                  <div className="w-px h-5 bg-white" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </motion.div>
  )
}

function Mobile() {
  return null
}

export const NavigationBar = {
  Desktop,
  Mobile,
} as const
