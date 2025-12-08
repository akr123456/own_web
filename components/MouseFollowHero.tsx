'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import PortraitAlt from '~/assets/Portrait.jpg'

const segoeUIBlackFont = `
  @font-face {
    font-family: 'Segoe UI Black';
    src: url('/fonts/SegoeUIBlack.ttf') format('truetype');
    font-weight: 900;
  }
`

export function MouseFollowHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // 平滑过渡的鼠标偏移（延迟跟随效果）
  const smoothX = mousePos.x * 0.03
  const smoothY = mousePos.y * 0.03

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] flex items-center justify-center overflow-hidden"
      style={{
        fontFamily: "'Segoe UI Black', sans-serif",
      } as React.CSSProperties}
    >
      <style>{segoeUIBlackFont}</style>
      
      {/* 第1层：环状半调装饰 */}
      <div className="absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none z-0" style={{ transform: 'translate(-50%, -50%) translateY(-40px)' }}>
        <div className="relative" style={{ width: '380px', height: '380px' }}>
          {/* 半调圆点效果 - 点密度更大，靠近圆心偏大，远离圆心偏小 */}
          <svg width="380" height="380" viewBox="0 0 380 380" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sizeGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="white"/>
                <stop offset="100%" stopColor="black"/>
              </radialGradient>
              <pattern id="halftone-dense" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="translate(7.5, 7.5)">
                <circle cx="0" cy="0" r="4.5" fill="#B3B3B3"/>
              </pattern>
              <mask id="ring-mask">
                <rect width="380" height="380" fill="white"/>
                <circle cx="190" cy="190" r="115" fill="black"/>
              </mask>
            </defs>
            {/* 环状区域使用径向渐变控制点的大小 */}
            <g mask="url(#ring-mask)">
              {/* 靠近圆心的圆点（较大） */}
              <circle cx="190" cy="190" r="142" fill="url(#halftone-dense)" opacity="1"/>
              {/* 过渡区域 */}
              <circle cx="190" cy="190" r="161" fill="url(#halftone-dense)" opacity="0.8"/>
              {/* 边缘圆点（较小） */}
              <circle cx="190" cy="190" r="180" fill="url(#halftone-dense)" opacity="0.6"/>
            </g>
          </svg>
        </div>
      </div>

      {/* 第2层：黄色长方形装饰 */}
      <div className="absolute left-1/2 top-1/2 flex items-center justify-center pointer-events-none z-10" style={{ transform: 'translate(-50%, -50%) translateY(-40px)' }}>
        <div className="absolute w-[720px] h-[120px] bg-[#FEFE2B] rounded-sm" />
      </div>

      {/* 第3层：背景文字 */}
      <div className="absolute left-1/2 top-1/2 flex items-center justify-center z-20" style={{ transform: 'translate(-50%, -50%) translateY(-40px)' }}>
        <h1 className="text-8xl sm:text-[7rem] md:text-[8rem] font-bold text-[#212121] dark:text-[#212121] text-center">
          HUANG
          <br />
          XUEMING
        </h1>
      </div>

      {/* 第4层：跟随鼠标的图片容器 */}
      <div
        ref={imageRef}
        className="absolute w-24 h-40 sm:w-28 sm:h-48 md:w-32 md:h-56 transition-transform duration-200 ease-out rounded-full border-4 border-[#CECECE] overflow-hidden shadow-lg z-30"
        style={{
          transform: `translate(calc(-50% + ${smoothX}px), calc(-50% - 40px + ${smoothY}px))`,
          top: '50%',
          left: '50%',
        }}
      >
        {/* 图片 - 使用渐变色替代（你可以用真实图片替换） */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-2xl overflow-hidden">
          {/* 如果有真实图片，用下面的代码替换上面的 div */}
          <Image
            src={PortraitAlt}
            alt="Hero"
            className="w-full h-full object-cover"
            fill
          />
          
          {/* 内部装饰纹理 */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.9"
                    numOctaves="4"
                    seed="2"
                  />
                </filter>
              </defs>
              <rect width="400" height="400" filter="url(#noise)" />
            </svg>
          </div>
        </div>

        {/* 光晕效果 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-2xl rounded-2xl -z-10" />
      </div>

      {/* 装饰元素 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
