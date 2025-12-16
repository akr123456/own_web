'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const originalBgColor = document.documentElement.style.getPropertyValue('--bg-color')
    const originalHtmlBg = document.documentElement.style.backgroundColor
    
    document.documentElement.style.setProperty('--bg-color', '#84CC16')
    document.documentElement.style.backgroundColor = '#84CC16'
    
    return () => {
      document.documentElement.style.setProperty('--bg-color', originalBgColor)
      document.documentElement.style.backgroundColor = originalHtmlBg
    }
  }, [])

  return null
}
