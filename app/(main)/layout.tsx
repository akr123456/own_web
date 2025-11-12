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
      {/* 使用两个重叠的渐变层，仅通过 opacity 切换以触发合成器层（GPU），避免在主题切换时触发昂贵的重绘 */}
      <span
        className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] opacity-100 dark:opacity-0 transition-opacity duration-200"
        style={{ willChange: 'opacity' }}
      />
      <span
        className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_100%)] opacity-0 dark:opacity-100 transition-opacity duration-200"
        style={{ willChange: 'opacity' }}
      />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-[rgba(247,247,247,0.85)] dark:bg-[rgba(0,0,0,0.80)] ring-1 ring-zinc-100 dark:ring-zinc-400/20" />
        </div>
      </div>

      <QueryProvider>
        {/* 顶部装饰色块已迁移到底部（见 main 后），保持空位以便快速回滚 */}

        <div className="relative text-zinc-800 dark:text-zinc-200">
          <Header />
          <main>{children}</main>

          <Suspense>
            <Footer />
          </Suspense>

          {/* 底部装饰色块（上）：灰色（较大），放在 Footer 之后，确保位于“总浏览量 / 浏览量组件”下方；非固定，与覆盖层同宽（max-w-7xl），随页面滚动 */}
          <div className="flex justify-center sm:px-8 pointer-events-none mt-6">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="h-[2.25rem] sm:h-[2.25rem] md:h-[3rem] lg:h-[3.75rem] w-full bg-[#CCCCCC] rounded-sm z-10" />
            </div>
          </div>

          {/* 底部装饰色块（下）：黄色（较小），尺寸为上方色块的 1/3（整体缩小 1/3 后的尺寸），紧邻灰色块下方 */}
          <div className="flex justify-center sm:px-8 pointer-events-none">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="h-[0.75rem] sm:h-[0.75rem] md:h-[1rem] lg:h-[1.25rem] w-full rounded-sm z-10 overflow-hidden">
                <div className="flex flex-row h-full">
                  {/* 左侧 1 份：深灰 #666666 */}
                  <div className="flex-[1] bg-[#666666]" />
                  {/* 右侧 19 份：黄色 #FEFE2B （1:19）*/}
                  <div className="flex-[19] bg-[#FEFE2B]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueryProvider>

      <Analytics />
    </>
  )
}
