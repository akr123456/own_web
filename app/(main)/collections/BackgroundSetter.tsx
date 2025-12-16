'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const originalBgColor = document.documentElement.style.getPropertyValue('--bg-color')
    const originalHtmlBg = document.documentElement.style.backgroundColor
    
    document.documentElement.style.setProperty('--bg-color', '#EC0938')
    document.documentElement.style.backgroundColor = '#EC0938'
    
    return () => {
      document.documentElement.style.setProperty('--bg-color', originalBgColor)
      document.documentElement.style.backgroundColor = originalHtmlBg
    }
  }, [])

  return null
}
