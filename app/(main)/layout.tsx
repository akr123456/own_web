import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

import { Footer } from '~/app/(main)/Footer'
import { Header } from '~/app/(main)/Header'
import { QueryProvider } from '~/app/QueryProvider'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
  {/* 移除原有的 grid 背景图（grid.svg / grid-black.svg），由全局样式负责背景 */}
  <div className="pointer-events-none fixed inset-0 select-none" />
  {/* 增强深色模式下的遮罩：使用更明显的暗色遮罩并保持渐变，减弱等高线在夜间的显眼程度 */}
  <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0)_100%)]" />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/95 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        <div className="relative text-zinc-800 dark:text-zinc-200">
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
