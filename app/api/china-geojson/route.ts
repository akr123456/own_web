import { type NextRequest } from 'next/server'

const UPSTREAM =
  'https://geo.datav.aliyun.com/areas/bound/100000_full.json'

export async function GET(_req: NextRequest) {
  try {
    const resp = await fetch(UPSTREAM, {
      // 让 Vercel/Next 在边缘缓存层复用结果，避免每个访客都直连上游
      next: { revalidate: 60 * 60 * 24 },
    })

    if (!resp.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch upstream geojson',
          status: resp.status,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const text = await resp.text()
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 额外声明缓存，浏览器也可以短期缓存
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Exception while fetching geojson',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}


