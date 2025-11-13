import { count, isNotNull } from 'drizzle-orm'
import React from 'react'

import { CursorClickIcon, UsersIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { Container } from '~/components/ui/Container'
import { kvKeys } from '~/config/kv'
import { db } from '~/db'
import { subscribers } from '~/db/schema'
import { env } from '~/env.mjs'
import { prettifyNumber } from '~/lib/math'
import { redis } from '~/lib/redis'

import { Newsletter } from './Newsletter'

async function TotalPageViews() {
  let views: number
  if (env.VERCEL_ENV === 'production') {
    views = await redis.incr(kvKeys.totalPageViews)
  } else {
    views = 345678
  }

  return (
    <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 md:justify-start">
      <UsersIcon className="h-4 w-4" />
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
    <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 md:justify-start">
      <CursorClickIcon className="h-4 w-4" />
      <span>
        最近访客来自&nbsp;
        {[lastVisitor.city, lastVisitor.country].filter(Boolean).join(', ')}
      </span>
      <span className="font-medium">{lastVisitor.flag}</span>
    </span>
  )
}

export async function Footer() {
  const [subs] = await db
    .select({
      subCount: count(),
    })
    .from(subscribers)
    .where(isNotNull(subscribers.subscribedAt))

  return (
    <footer className="relative z-10 mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40 md:pb-24 md:pt-6">
          <Container.Inner className="relative pb-16 sm:pb-20 md:pb-28">
            <div className="mx-auto mb-8 max-w-md">
              <Newsletter subCount={`${subs?.subCount ?? '0'}`} />
            </div>
            {/* 将版权与访客信息放到与黄色色块相同的 max-w-7xl 容器，以便对齐并在桌面覆盖色块 */}
            <div className="flex justify-center md:justify-start sm:px-8">
              <div className="flex w-full max-w-7xl lg:px-8 md:relative md:z-40">
                <div className="flex w-full flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-start md:gap-6 md:text-left md:translate-y-[3.5rem] lg:translate-y-[12.5rem]">
                  <p className="text-sm text-zinc-500/80 dark:text-zinc-400/80 md:max-w-md md:ml-[-11%] md:text-left">
                    &copy; {new Date().getFullYear()} Cali Castle. 网站已开源：
                    <PeekabooLink href="https://github.com/CaliCastle/cali.so">
                      GitHub
                    </PeekabooLink>
                  </p>
                  <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start md:gap-6">
                    <React.Suspense>
                      <TotalPageViews />
                    </React.Suspense>
                    <React.Suspense>
                      <LastVisitorInfo />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            </div>
          </Container.Inner>
          {/* 底部装饰色块，与 Footer 内容同宽，紧贴底部 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col sm:px-8">
            <div className="flex justify-center">
                <div className="flex w-full max-w-7xl lg:px-8">
                  <div className="h-[4rem] sm:h-[4rem] md:h-[5rem] lg:h-[7rem] w-full rounded-t-sm bg-[#CCCCCC]" />
                </div>
            </div>
            <div className="flex justify-center">
              <div className="flex w-full max-w-7xl lg:px-8">
                <div className="h-[0.75rem] sm:h-[0.75rem] md:h-[2rem] lg:h-[2.5rem] w-full overflow-hidden rounded-b-sm">
                  <div className="flex h-full">
                    <div className="flex-[0.7] bg-[#666666]" />
                    <div className="flex-[19] bg-[#FEFE2B]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container.Outer>
    </footer>
  )
}

