'use client'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { clsxm } from '@zolplay/utils'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

import { NavigationBar } from '~/app/(main)/NavigationBar'
import { ThemeSwitcher } from '~/app/(main)/ThemeSwitcher'
import {
  GitHubBrandIcon,
  GoogleBrandIcon,
  MailIcon,
  UserArrowLeftIcon,
} from '~/assets'
import { Avatar } from '~/components/Avatar'
import { Container } from '~/components/ui/Container'
import { Tooltip } from '~/components/ui/Tooltip'
import { url } from '~/lib'
import { clamp } from '~/lib/math'
export function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const headerRef = React.useRef<HTMLDivElement>(null)
  const avatarRef = React.useRef<HTMLDivElement>(null)
  const isInitial = React.useRef(true)

  const avatarX = useMotionValue(0)
  const avatarScale = useMotionValue(1)
  const avatarBorderX = useMotionValue(0)
  const avatarBorderScale = useMotionValue(1)

  React.useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0
    const upDelay = 64

    function setProperty(property: string, value: string | null) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return
      }

      const { top, height } = headerRef.current.getBoundingClientRect()
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return
      }

      const fromScale = 1
      const toScale = 36 / 64
      const fromX = 0
      const toX = 2 / 16

      const scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      avatarX.set(x)
      avatarScale.set(scale)

      const borderScale = 1 / (toScale / scale)

      avatarBorderX.set((-toX + x) * borderScale)
      avatarBorderScale.set(borderScale)

      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0')
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomePage])

  const avatarTransform = useMotionTemplate`translate3d(${avatarX}rem, 0, 0) scale(${avatarScale})`
  const avatarBorderTransform = useMotionTemplate`translate3d(${avatarBorderX}rem, 0, 0) scale(${avatarBorderScale})`

  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false)
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsShowingAltAvatar((prev) => !prev)
    },
    []
  )

  return (
    <>
      {/* 非首页顶部色块 - 白天模式使用#FEFE2B，黑夜模式使用#B0FA41，高度略微增大 */}
      {/* 排除博客文章详情页面，只在博客列表页和其他页面显示 */}
      {!isHomePage && !pathname.startsWith('/blog/') && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="flex w-full max-w-7xl lg:px-8">
            <motion.div
              className="h-[240px] w-full bg-[#FEFE2B] dark:bg-[#B0FA41] opacity-90 z-50 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 200,
              }}
            >
              {/* 添加bg.png作为覆盖层背景装饰，并使其效果最明显 */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'url(/bg.png)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: 'auto',
                  opacity: 1, // 最大不透明度使其完全可见
                  mixBlendMode: 'multiply', // 增强对比度
                  filter: 'contrast(2) brightness(1.5) saturate(2)' // 最大化视觉效果
                }}
              />
              
              {/* 移除了单独的黑色色块，因为它已经被融入到SVG中 */}

              {/* 页面名称 - 统一使用SVG替代文字 */}
              <div className="absolute bottom-[0px] left-[calc(100%*1/8-20px)] z-[1001] overflow-visible">
                {pathname === '/blog' || pathname.startsWith('/blog/') ? (
                  <>
                    <img src="/triangle.svg" alt="triangle" style={{ position: 'absolute', top: '-65px', left: '5px', zIndex: 1002, display: 'block', height: '100px', width: '100px' }} />
                    <img src="/BLOG.svg" alt="BLOG" style={{ height: '100px', width: 'auto', zIndex: 1001, display: 'block' }} />
                  </>
                ) : pathname === '/footprints' || pathname.startsWith('/footprints/') ? (
                  <img src="/FOOTPRINTS.svg" alt="FOOTPRINTS" style={{ height: '80px', width: 'auto', zIndex: 1001, display: 'block' }} />
                ) : pathname === '/collections' || pathname.startsWith('/collections/') ? (
                  <img src="/COLLECTIONS.svg" alt="COLLECTIONS" style={{ height: '80px', width: 'auto', zIndex: 1001, display: 'block' }} />
                ) : pathname === '/guestbook' || pathname.startsWith('/guestbook/') ? (
                  <img src="/GUESTBOOK.svg" alt="GUESTBOOK" style={{ height: '80px', width: 'auto', zIndex: 1001, display: 'block' }} />
                ) : pathname === '/contact' || pathname.startsWith('/contact/') ? (
                  <img src="/CONTACT.svg" alt="CONTACT" style={{ height: '80px', width: 'auto', zIndex: 1001, display: 'block' }} />
                ) : pathname === '/projects' || pathname.startsWith('/projects/') ? (
                  <img src="/PROJECTS.svg" alt="PROJECTS" style={{ height: '80px', width: 'auto', zIndex: 1001, display: 'block' }} />
                ) : (
                  'PAGE'
                )}
              </div>

              {/* 向右下方移动与黑色色块上下居中对齐，并调整长度与黄色块一致 */}
              <div className="absolute bottom-[-66px] left-0 w-full z-60">
                <img src="/Diagonal-long.svg" alt="Diagonal Long" className="h-40 w-full" />
              </div>

              {/* 直接在页面上放置SVG文件 */}
              <div className="absolute bottom-[30px] left-[calc(100%*1/8-15px)] z-[1000] overflow-visible">
                {pathname === '/blog' || pathname.startsWith('/blog/') ? (
                  // 对于blog页面，使用Diagonal-BLOG.svg文件
                  <img
                    src="/Diagonal-BLOG.svg"
                    alt="BLOG Background"
                    style={{
                      // 设置明确的尺寸确保可见
                      height: '120px',
                      width: 'auto',
                      // 确保SVG正确显示
                      display: 'block',
                      // 确保层级最高
                      zIndex: 1000
                    }}
                  />
                ) : pathname === '/footprints' || pathname.startsWith('/footprints/') ? (
                  // 对于footprints页面，使用对应的背景SVG文件
                  <img
                    src="/Diagonal-FOOTPRINTS.svg"
                    alt="FOOTPRINTS Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                ) : pathname === '/collections' || pathname.startsWith('/collections/') ? (
                  // 对于collections页面，使用对应的背景SVG文件
                  <img
                    src="/Diagonal-COLLECTIONS.svg"
                    alt="COLLECTIONS Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                ) : pathname === '/guestbook' || pathname.startsWith('/guestbook/') ? (
                  // 对于guestbook页面，使用对应的背景SVG文件
                  <img
                    src="/Diagonal-GUESTBOOK.svg"
                    alt="GUESTBOOK Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                ) : pathname === '/contact' || pathname.startsWith('/contact/') ? (
                  // 对于contact页面，使用对应的背景SVG文件
                  <img
                    src="/Diagonal-CONTACT.svg"
                    alt="CONTACT Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                ) : pathname === '/projects' || pathname.startsWith('/projects/') ? (
                  // 对于projects页面，使用对应的背景SVG文件
                  <img
                    src="/Diagonal-PROJECTS.svg"
                    alt="PROJECTS Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                ) : (
                  // 其他页面使用默认背景图案
                  <img
                    src="/Diagonal-long.svg"
                    alt="Default Background"
                    style={{
                      height: '120px',
                      width: 'auto',
                      display: 'block',
                      zIndex: 1000
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <motion.header
        className={clsxm(
          'pointer-events-none relative z-50 mb-[var(--header-mb,0px)] flex flex-col',
          isHomePage
            ? 'h-[var(--header-height,180px)]'
            : 'h-[var(--header-height,64px)]'
        )}
        layout
        layoutRoot
      >
        <AnimatePresence>
          {isHomePage && (
            <>
              <div
                ref={avatarRef}
                className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
              />
              <Container
                className="top-0 order-last -mb-3 pt-3"
                style={{
                  position:
                    'var(--header-position)' as React.CSSProperties['position'],
                }}
              >
                <motion.div
                  className="top-[var(--avatar-top,theme(spacing.3))] w-full select-none"
                  style={{
                    position:
                      'var(--header-inner-position)' as React.CSSProperties['position'],
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="relative inline-flex"
                    layoutId="avatar"
                    layout
                    onContextMenu={onAvatarContextMenu}
                  >
                    <motion.div
                      className="absolute left-0 top-3 origin-left opacity-[var(--avatar-border-opacity,0)] transition-opacity"
                      style={{
                        transform: avatarBorderTransform,
                      }}
                    >
                      <Avatar />
                    </motion.div>

                    <motion.div
                      className="block h-16 w-16 origin-left"
                      style={{
                        transform: avatarTransform,
                      }}
                    >
                      <Avatar.Image
                        large
                        alt={isShowingAltAvatar}
                        className="block h-full w-full"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Container>
            </>
          )}
        </AnimatePresence>
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div className="relative flex gap-4">
              <motion.div
                className="flex flex-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 200,
                }}
              >
                <AnimatePresence>
                  {!isHomePage && (
                    <motion.div
                      layoutId="avatar"
                      layout
                      onContextMenu={onAvatarContextMenu}
                    >
                      <Avatar>
                        <Avatar.Image alt={isShowingAltAvatar} />
                      </Avatar>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="flex flex-1 justify-end md:justify-center">
                <NavigationBar.Mobile className="pointer-events-auto relative z-50 md:hidden" />
                <NavigationBar.Desktop className="pointer-events-auto relative z-50 hidden md:block" />
              </div>
              <motion.div
                className="flex justify-end gap-3 md:flex-1"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <UserInfo />
                <div className="pointer-events-auto">
                  <ThemeSwitcher />
                </div>
              </motion.div>
              {/* 
              <AnimatePresence>
                {!isHomePage && (
                  <motion.div
                    className="absolute left-14 top-1 flex h-8 items-center"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 1 },
                    }}
                  >
                    <Activity />
                  </motion.div>
                )}
              </AnimatePresence> */}
            </div>
          </Container>
        </div>
      </motion.header>
      {isHomePage && <div className="h-[--content-offset]" />}
    </>
  )
}

function UserInfo() {
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy
    if (!strategy) {
      return null
    }

    switch (strategy) {
      case 'from_oauth_github':
        return GitHubBrandIcon as (
          props: React.ComponentProps<'svg'>
        ) => JSX.Element
      case 'from_oauth_google':
        return GoogleBrandIcon
      default:
        return MailIcon
    }
  }, [user?.primaryEmailAddress?.verification.strategy])

  return (
    <AnimatePresence>
      <SignedIn key="user-info">
        <motion.div
          className="pointer-events-auto relative flex h-10 items-center"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <UserButton
            afterSignOutUrl={url(pathname).href}
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-white/20',
              },
            }}
          />
          {StrategyIcon && (
            <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <StrategyIcon className="h-3 w-3" />
            </span>
          )}
        </motion.div>
      </SignedIn>
      <SignedOut key="sign-in">
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <Tooltip.Provider disableHoverableContent>
            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <SignInButton mode="modal" redirectUrl={url(pathname).href}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  >
                    <UserArrowLeftIcon className="h-5 w-5" />
                  </button>
                </Tooltip.Trigger>
              </SignInButton>

              <AnimatePresence>
                {tooltipOpen && (
                  <Tooltip.Portal forceMount>
                    <Tooltip.Content asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        登录
                      </motion.div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </AnimatePresence>
            </Tooltip.Root>
          </Tooltip.Provider>
        </motion.div>
      </SignedOut>
    </AnimatePresence>
  )
}
