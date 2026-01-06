import { type NextRequest } from 'next/server'
import { groq } from 'next-sanity'

import { client } from '~/sanity/lib/client'

export async function GET(_req: NextRequest) {
  const q = groq`
    *[_type == "footprint"]{
      _id,
      name,
      province,
      city,
      visitedAt,
      mapHighlight,
      mapColor
    }
  `

  const data = await client.fetch(q)
  return new Response(JSON.stringify(data || []), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
