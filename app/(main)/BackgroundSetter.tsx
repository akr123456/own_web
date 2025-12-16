'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const root = document.documentElement
    const originalBg = root.style.backgroundColor
    const originalBgImage = root.style.backgroundImage
    const originalBgSize = root.style.backgroundSize
    const originalBgPosition = root.style.backgroundPosition
    const originalBgAttachment = root.style.backgroundAttachment

    // 设置背景图片
    root.style.setProperty('--bg-color', 'transparent')
    root.style.backgroundColor = 'transparent'
    root.style.backgroundImage = 'url("/bg.png")'
    root.style.backgroundSize = 'cover'
    root.style.backgroundPosition = 'center'
    root.style.backgroundAttachment = 'fixed'

    return () => {
      root.style.backgroundColor = originalBg
      root.style.backgroundImage = originalBgImage
      root.style.backgroundSize = originalBgSize
      root.style.backgroundPosition = originalBgPosition
      root.style.backgroundAttachment = originalBgAttachment
    }
  }, [])

  return null
}
