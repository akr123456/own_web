import Image from 'next/image'
import React from 'react'

import { BriefcaseIcon } from '~/assets'

type Resume = {
  company: string
  title: string
  start: string
  end?: string | null
  logo: string
}

export function Resume({ resume }: { resume: Resume[] }) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex items-center text-base font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-2">工作经历</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="relative flex items-center gap-4">
            {/* 斜线纹理长圆形装饰 */}
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute left-[-12px] right-[-25px] top-1/2 h-16 -translate-y-1/2 rounded-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, rgba(206,206,206,0.7) 0, rgba(206,206,206,0.7) 2px, transparent 2px, transparent 5px)',
                  opacity: 0.6,
                  filter: 'blur(0.2px)',
                }}
              />
            </div>

            <div
              className="relative z-10 mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full dark:bg-zinc-800"
              style={{ boxShadow: '0 0 0 3px #FEFE2B, 0 8px 18px rgba(0,0,0,0.08)' }}
            >
              <Image
                src={role.logo}
                alt={role.company}
                className="h-8 w-8 rounded-full"
                width={100}
                height={100}
                unoptimized
              />
            </div>
            <dl className="relative z-10 flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">公司</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>
              <dt className="sr-only">职位</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>
              <dt className="sr-only">日期</dt>
              <dd className="ml-auto text-xs text-zinc-500/80 dark:text-zinc-400/80">
                {role.start}
                <span aria-hidden="true">—</span> {role.end ?? '至今'}
              </dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
