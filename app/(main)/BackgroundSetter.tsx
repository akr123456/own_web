'use client'

import { useEffect } from 'react'

export function BackgroundSetter() {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    const originals = {
      varBgColor: root.style.getPropertyValue('--bg-color') || '',
      rootBgImage: root.style.backgroundImage || '',
      rootBgPosition: root.style.backgroundPosition || '',
      rootBgRepeat: root.style.backgroundRepeat || '',
      rootBgSize: root.style.backgroundSize || '',
      rootBgAttachment: root.style.backgroundAttachment || '',
      rootBgColor: root.style.backgroundColor || '',
      bodyBgImage: body.style.backgroundImage || '',
      bodyBgPosition: body.style.backgroundPosition || '',
      bodyBgRepeat: body.style.backgroundRepeat || '',
      bodyBgSize: body.style.backgroundSize || '',
      bodyBgAttachment: body.style.backgroundAttachment || '',
      bodyBgColor: body.style.backgroundColor || '',
    }

    // 全局首页背景：使用 public 下的 bg.jpg，靠底部展示（不覆盖 blog 页面，因为 blog 有自己 BackgroundSetter）
    // 确保 html 与 body 背景颜色为透明，这样 html 的背景图片才能可见
    root.style.setProperty('--bg-color', originals.varBgColor)
    root.style.backgroundColor = 'transparent'
    root.style.backgroundImage = 'url(/bg.jpg)'
    root.style.backgroundPosition = 'center bottom'
    root.style.backgroundRepeat = 'no-repeat'
    root.style.backgroundSize = 'cover'
    root.style.backgroundAttachment = 'fixed'

    // body 一般不需要图片，保持透明以便显示 html 背景
    body.style.backgroundImage = originals.bodyBgImage
    body.style.backgroundColor = 'transparent'

    return () => {
      root.style.backgroundImage = originals.rootBgImage
      root.style.backgroundPosition = originals.rootBgPosition
      root.style.backgroundRepeat = originals.rootBgRepeat
      root.style.backgroundSize = originals.rootBgSize
      root.style.backgroundAttachment = originals.rootBgAttachment
      root.style.backgroundColor = originals.rootBgColor
      root.style.setProperty('--bg-color', originals.varBgColor)

      body.style.backgroundImage = originals.bodyBgImage
      body.style.backgroundPosition = originals.bodyBgPosition
      body.style.backgroundRepeat = originals.bodyBgRepeat
      body.style.backgroundSize = originals.bodyBgSize
      body.style.backgroundAttachment = originals.bodyBgAttachment
      body.style.backgroundColor = originals.bodyBgColor
    }
  }, [])

  return null
}
