import React from 'react'

import { CursorClickIcon, UsersIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { Container } from '~/components/ui/Container'
import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { prettifyNumber } from '~/lib/math'
import { redis } from '~/lib/redis'

// eslint-disable-next-line @typescript-eslint/require-await
async function TotalPageViews() {
  let views: number
  if (env.VERCEL_ENV === 'production') {
    views = await redis.incr(kvKeys.totalPageViews)
  } else {
    views = 345678
  }

  return (
    <span className="flex items-center justify-center gap-1 text-[12px] text-zinc-500 dark:text-zinc-400 md:justify-start">
      <UsersIcon className="h-3.5 w-3.5" />
      <span title={`${Intl.NumberFormat('en-US').format(views)}次浏览`}>
        总浏览量&nbsp;
        <span className="font-medium">{prettifyNumber(views, true)}</span>
      </span>
    </span>
  )
}

type VisitorGeolocation = {
  country: string
  city?: string
  flag: string
}

// eslint-disable-next-line @typescript-eslint/require-await
async function LastVisitorInfo() {
  let lastVisitor: VisitorGeolocation | undefined = undefined
  if (env.VERCEL_ENV === 'production') {
    const [lv, cv] = await redis.mget<VisitorGeolocation[]>(
      kvKeys.lastVisitor,
      kvKeys.currentVisitor
    )
    lastVisitor = lv
    await redis.set(kvKeys.lastVisitor, cv)
  }

  if (!lastVisitor) {
    lastVisitor = {
      country: 'US',
      flag: '🇺🇸',
    }
  }

  return (
    <span className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 md:justify-start">
      <CursorClickIcon className="h-3.5 w-3.5" />
      <span>
        最近访客来自&nbsp;
        {[lastVisitor.city, lastVisitor.country].filter(Boolean).join(', ')}
      </span>
      <span className="font-medium">{lastVisitor.flag}</span>
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-4 pt-10 dark:border-zinc-700/40">
          {/* 新增文字内容 */}
          <Container.Inner className="mb-12">
            <div className="flex flex-col items-center">
              <div className="text-[44px] font-black text-[#7C7C7C]">[ END ]</div>
              <div className="text-lg font-medium text-[#7C7C7C] mt-2">如果你喜欢我的内容，不妨在首页订阅或在社媒与我互动！</div>
            </div>
          </Container.Inner>
          <Container.Inner>
            <div className="flex flex-row items-center justify-center gap-6">
              <React.Suspense>
                <TotalPageViews />
              </React.Suspense>
              <React.Suspense>
                <LastVisitorInfo />
              </React.Suspense>
            </div>
          </Container.Inner>
          <Container.Inner className="mt-3">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-sm text-[#212121] font-bold">
                © {new Date().getFullYear()} Holix. 网站已开源：
                <PeekabooLink href="https://github.com/akr123456/own_web">
                  GitHub
                </PeekabooLink>
              </p>
            </div>
          </Container.Inner>
        </div>

        {/* 新色块 - 宽度为灰色块的1/10，高度为原来的1/3 */}
        <div className="h-1 bg-[#CECECE] w-1/10 flex justify-center items-center gap-0">
          {/* 左侧粉色色块 - 宽度为色块的1/12 */}
          <div className="h-full w-1/12 bg-[#DE16CC]" />
          {/* 中间黄色分区 - 宽度为色块的1/12（原1/6的1/2） */}
          <div className="h-full w-1/12 bg-[#FEFE2B]" />
          {/* 右侧绿色色块 - 宽度为色块的1/12 */}
          <div className="h-full w-1/12 bg-[#22EFAF]" />
        </div>
        {/* 页面底部长条 */}
        <div className="h-8 bg-[#B3B3B3] w-full" />
      </Container.Outer>
    </footer>
  )
}
