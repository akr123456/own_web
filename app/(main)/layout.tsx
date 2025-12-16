import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import Footer from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>


      {/* 顶部渐变效果 */}
      <span className="pointer-events-none fixed top-0 z-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      {/* 大背景装饰层：置于大背景与覆盖层之间，贴齐页面左右边框 */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {/* 左上角 PNG（#000000） */}
        <span
          aria-hidden
          className="absolute top-0 left-0 h-64 w-2/3"
          style={{
            backgroundColor: '#000000',
            WebkitMaskImage: 'url(/bg_top.png)',
            maskImage: 'url(/bg_top.png)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'auto 100%',
            maskSize: 'auto 100%',
            WebkitMaskPosition: 'left top',
            maskPosition: 'left top',
          }}
        />
        {/* 左下角 PNG（#CECECE） */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-64 w-2/3"
          style={{
            backgroundColor: '#E5E5E5',
            WebkitMaskImage: 'url(/bg_left.png)',
            maskImage: 'url(/bg_left.png)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'auto 100%',
            maskSize: 'auto 100%',
            WebkitMaskPosition: 'left bottom',
            maskPosition: 'left bottom',
          }}
        />
        {/* 右上角 PNG（#CECECE） */}
        <span
          aria-hidden
          className="absolute top-0 right-0 h-64 w-2/3"
          style={{
            backgroundColor: '#CECECE',
            WebkitMaskImage: 'url(/bg_right.png)',
            maskImage: 'url(/bg_right.png)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'auto 100%',
            maskSize: 'auto 100%',
            WebkitMaskPosition: 'right top',
            maskPosition: 'right top',
          }}
        />
      </div>

      {/* 平铺背景 - 暂时移除以降低绘制与合成开销 */}
      {/* <div className="pointer-events-none fixed inset-0 opacity-25 dark:opacity-12" style={{ backgroundImage: 'url(/light.png)', backgroundRepeat: 'repeat' }}></div> */}

      {/* 覆盖层 - 完全不透明 */}
      <div className="pointer-events-none fixed inset-0 z-20 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-[rgb(245,245,245)] ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <div className="relative z-30 text-zinc-800 dark:text-zinc-200">
          <Header />
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </QueryProvider>

      <Analytics />
    </>
  )
}
