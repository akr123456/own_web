import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { Newsletter } from '~/app/(main)/Newsletter'
import { Photos } from '~/app/(main)/Photos'
import { Resume } from '~/app/(main)/Resume'
import { PencilSwooshIcon } from '~/assets'
import { MouseFollowHero } from '~/components/MouseFollowHero'
import { Container } from '~/components/ui/Container'
import { getSettings } from '~/sanity/queries'

export default async function BlogHomePage() {
  const settings = await getSettings()

  return (
    <>
      {/* 鼠标跟随英雄区 */}
      <MouseFollowHero />

      {/* 向下箭头 */}
      <div className="flex justify-center -mt-16 -mb-4 relative z-20">
        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" className="text-zinc-600 dark:text-zinc-400" d="m12 19.164l6.207-6.207l-1.414-1.414L12 16.336l-4.793-4.793l-1.414 1.414L12 19.164Zm0-5.65l6.207-6.207l-1.414-1.414L12 10.686L7.207 5.893L5.793 7.307L12 13.514Z"/>
        </svg>
      </div>

      <Container className="mt-4 sm:mt-6 md:mt-8">
        <Headline />
      </Container>

      {settings?.heroPhotos && <Photos photos={settings.heroPhotos} />}

      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-6 pt-6">
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <PencilSwooshIcon className="h-5 w-5 flex-none" />
              <span className="ml-2">近期文章</span>
            </h2>
            <BlogPosts />
          </div>
          <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
            <Newsletter />
            {settings?.resume && <Resume resume={settings.resume} />}
          </aside>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
