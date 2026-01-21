"use client"

import dynamic from 'next/dynamic'

// 关键：关闭 SSR，确保 echarts 相关逻辑只会在浏览器端执行
const ChinaMap = dynamic(() => import('~/components/ChinaMap'), { ssr: false })

export default function ChinaMapClient() {
  return <ChinaMap />
}


