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

      {/* PageTransition temporarily removed */}


      {/* 顶部渐变效果（已移除，仅保留 SVG 装饰） */}
      {/* ...existing code... */}

      {/* 平铺背景 - 暂时移除以降低绘制与合成开销 */}
      {/* <div className="pointer-events-none fixed inset-0 opacity-25 dark:opacity-12" style={{ backgroundImage: 'url(/light.png)', backgroundRepeat: 'repeat' }}></div> */}

      {/* 覆盖层 - 完全不透明 */}
      <div className="pointer-events-none fixed inset-0 z-20 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div
            className="w-full ring-1 ring-zinc-100 dark:ring-zinc-400/20"
            style={{ backgroundColor: 'var(--layout-overlay-bg, rgb(245,245,245))' }}
            data-layout-overlay
          />
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
