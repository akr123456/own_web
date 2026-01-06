'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const originalBgColor = document.documentElement.style.getPropertyValue('--bg-color')
    const originalHtmlBg = document.documentElement.style.backgroundColor
    
    document.documentElement.style.setProperty('--bg-color', '#ff6400')
    document.documentElement.style.backgroundColor = '#ff6400'
    
    return () => {
      document.documentElement.style.setProperty('--bg-color', originalBgColor)
      document.documentElement.style.backgroundColor = originalHtmlBg
    }
  }, [])

  return null
}
