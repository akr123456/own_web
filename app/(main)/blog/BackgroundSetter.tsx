'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const originalBgColor = root.style.getPropertyValue('--bg-color') || ''
    const originalHtmlBg = root.style.backgroundColor || ''
    const originalBgImage = root.style.backgroundImage || ''
    const originalBodyBgImage = body.style.backgroundImage || ''

    root.style.setProperty('--bg-color', '#0F3DFF')
    root.style.backgroundColor = '#0F3DFF'
    // 确保不显示全局的 bg.jpg
    root.style.backgroundImage = 'none'
    body.style.backgroundImage = 'none'

    return () => {
      root.style.setProperty('--bg-color', originalBgColor)
      root.style.backgroundColor = originalHtmlBg
      root.style.backgroundImage = originalBgImage
      body.style.backgroundImage = originalBodyBgImage
    }
  }, [])

  return null
}
