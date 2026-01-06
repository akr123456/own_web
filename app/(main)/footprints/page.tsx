import { type Metadata } from 'next'

// Projects 在其它页面展示，足迹页不再重复渲染
import ChinaMap from '~/components/ChinaMap'
import { Container } from '~/components/ui/Container'

import { BackgroundSetter } from './BackgroundSetter'

const title = '我的足迹'
const description = '我的旅行与到访记录；在 Sanity 中配置地点并启用地图高亮后，本页地图会反映相应省份的高亮与信息。'
export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
} satisfies Metadata

export default function FootprintsPage() {
  return (
    <>
      <BackgroundSetter />
      <Container className="mt-32 sm:mt-48">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            我的足迹记录
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            多年来，我一直在做各种各样的小项目，有<b>开源</b>的，有<b>实验</b>
            的，也有 <b>just for fun </b>
            的，下面就是我筛选出来我觉得还不错的项目合集，也是我在技术领域中尝试和探索的最好见证。
          </p>
        </header>
        <div className="mt-8 sm:mt-12">
          <ChinaMap />
        </div>

        {/* Projects 已移除 — 足迹页只展示地图和统计 */}
      </Container>
    </>
  )
}

export const revalidate = 3600


