 'use client'

import { type ComponentProps } from '@zolplay/react'
import { clsxm } from '@zolplay/utils'
import Image from 'next/image'
import Link, { type LinkProps } from 'next/link'
import { useTheme } from 'next-themes'
import { useState } from 'react'

import portraitDark from '~/assets/Portrait-dark.png'
import portraitLight from '~/assets/Portrait-light.png'
import portraitAltImage from '~/assets/PortraitAlt.jpg'

function AvatarContainer({ className, ...props }: ComponentProps) {
  return (
    <div
      className={clsxm(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10'
      )}
      {...props}
    />
  )
}

type AvatarImageProps = ComponentProps &
  Omit<LinkProps, 'href'> & {
    large?: boolean
    href?: string
    alt?: boolean
  }
function AvatarImage({
  large = false,
  className,
  href,
  alt,
  ...props
}: AvatarImageProps) {
  const { resolvedTheme } = useTheme()
  const [showAlt, setShowAlt] = useState(false)

  // decide which image to show:
  let src = portraitLight
  if (showAlt) src = portraitAltImage
  else if (alt) src = portraitAltImage
  else if (resolvedTheme === 'dark') src = portraitDark

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    setShowAlt((s) => !s)
  }

  function handleClick() {
    if (showAlt) setShowAlt(false)
  }

  return (
    <Link
      aria-label="主页"
      className={clsxm(className, 'pointer-events-auto')}
      href={href ?? '/'}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      {...props}
    >
      <Image
        src={src}
        alt=""
        sizes={large ? '4rem' : '2.25rem'}
        className={clsxm(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 shadow-[0_6px_18px_rgba(0,0,0,0.18)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.45)]',
          large ? 'h-16 w-16' : 'h-9 w-9'
        )}
        priority
      />
    </Link>
  )
}

export const Avatar = Object.assign(AvatarContainer, { Image: AvatarImage })
