import React from 'react'

type ArrowProps = {
  className?: string
  width?: number | string
  height?: number | string
  color?: string
  direction?: 'ltr' | 'rtl'
}

export default function ArrowIcon({
  className,
  width = '256',
  height = '256',
  color = '#FEFE2B',
  direction = 'ltr',
}: ArrowProps) {
  const groupTransform = direction === 'rtl' ? 'translate(1024 0) scale(-1 1)' : undefined

  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
    >
      <g transform={groupTransform}>
        <path d="M555.853 62l406.147 450-406.147 450z" fill={color} />
        <path d="M62 292.625h624.015v438.75h-624.015v-438.75z" fill={color} />
      </g>
    </svg>
  )
}
