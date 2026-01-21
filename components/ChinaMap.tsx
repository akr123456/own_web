"use client"

import React, { useEffect, useRef, useState } from "react"

type EChartsModule = typeof import('echarts')

export default function ChinaMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  type EChartsLike = { setOption: (opt: unknown) => void; resize: () => void; dispose: () => void }
  const chartRef = useRef<EChartsLike | null>(null)
  const [counts, setCounts] = useState({ visited: 0, total: 0, cities: 0 })
  const [debugState, setDebugState] = useState({
    echartsLoaded: false,
    geoLoaded: false,
    footprintsCount: 0,
    chartInit: false,
    containerW: 0,
    containerH: 0,
    geoError: '',
    echartsError: '',
  })

  useEffect(() => {
    let disposed = false

    async function init() {
      // 使用已安装的 echarts 包，避免依赖 CDN 被 CSP/CORS 阻止
      let echarts: EChartsModule | null = null
      try {
        const echartsModule = await import('echarts')
        const mod = echartsModule as unknown as Record<string, unknown>
        echarts = (mod['default'] ?? echartsModule) as EChartsModule
      } catch (e) {
        echarts = null
      }

      if (!echarts) {
        try { setDebugState(s => ({ ...s, echartsError: 'echarts import failed' })) } catch (e) {}
        return
      }

      try { setDebugState(s => ({ ...s, echartsLoaded: true })) } catch (e) {}

      // 通过同源 API 代理加载 GeoJSON，避免浏览器直连上游产生 CORS/网络问题（Vercel 部署常见）
      let chinaJson: unknown = null
      try {
        const resp = await fetch('/api/china-geojson')
        if (!resp.ok) {
          try { setDebugState(s => ({ ...s, geoError: `geo fetch failed: ${resp.status}` })) } catch (e) {}
          return
        }
        chinaJson = await resp.json()
      } catch (e) {
        try { setDebugState(s => ({ ...s, geoError: 'geo fetch exception' })) } catch (e2) {}
        return
      }

      try { setDebugState(s => ({ ...s, geoLoaded: true })) } catch (e) {}

      if (disposed || !containerRef.current) return

      // 运行时做最小的形状校验后再传入，避免把 `any` 传给严格类型的注册函数
      type GeoJSONLike = { type?: string; features?: unknown[]; [k: string]: unknown }
      if (typeof chinaJson === 'object' && chinaJson !== null) {
        const geo = chinaJson as GeoJSONLike
        // ECharts 期望 FeatureCollection；若上游缺失则兜底写入，随后强制断言为 MapInput
        if (!geo.type) geo.type = 'FeatureCollection'
        echarts.registerMap("china", geo as unknown as Parameters<EChartsModule['registerMap']>[1])
        // 构建一个从规范化名字到 GeoJSON 中真实名字的映射，便于容错匹配
        const featureNameMap: Record<string, string> = {}
        try {
          const features = Array.isArray(geo.features) ? geo.features : []
          for (const feat of features) {
            if (!feat || typeof feat !== 'object') continue
            const f = feat as Record<string, unknown>
            const propsRaw = f['properties']
            const props =
              propsRaw && typeof propsRaw === 'object'
                ? (propsRaw as Record<string, unknown>)
                : {}
            const fname =
              props['name'] ??
              props['NAME'] ??
              props['name_zh'] ??
              props['fullName'] ??
              ''
            if (!fname) continue
            const key = String(fname)
              .replace(
                /(省|市|自治区|特别行政区|回族自治区|维吾尔自治区|壮族自治区|自治州|州|盟|地区|县|区)$/u,
                ''
              )
              .trim()
              .toLowerCase()
            featureNameMap[key] = String(fname)
          }
        } catch (e) {
          // ignore
        }

        const chart = echarts.init(containerRef.current)
        chartRef.current = chart

        try { setDebugState(s => ({ ...s, chartInit: true })) } catch (e) {}

        // 先尝试从 Sanity API 获取动态的足迹数据（server route）
        let footprints: Array<Record<string, unknown>> = []
        try {
          const res = await fetch('/api/footprints')
          const raw = await res.json()
          if (Array.isArray(raw)) footprints = raw as Array<Record<string, unknown>>
          else footprints = []
        } catch (e) {
          footprints = []
        }

        try { setDebugState(s => ({ ...s, footprintsCount: footprints.length })) } catch (e) {}

        const travelData: Record<string, { isVisited: boolean; cities?: Array<{ name: string; time?: string }>; mapColor?: string }> = {}

        // 用来自 Sanity 的数据填充
        for (const f of footprints) {
          if (!f || !f.province) continue
          const rawProvince = String(f.province)
          const provinceKey = rawProvince.replace(/(省|市|自治区|特别行政区|回族自治区|维吾尔自治区|壮族自治区|自治州|州|盟|地区|县|区)$/u, '').trim().toLowerCase()
          // 找到 GeoJSON 中的真实名称；若找不到，仍使用原值
          const provinceName = featureNameMap[provinceKey] || rawProvince

          // 对从 Sanity 返回的未知结构进行窄化处理，确保 cities 中的 name/time 是 string
          const cityVal = f['city'] ?? f['name']
          const cityName = typeof cityVal === 'string' ? cityVal : ''
          const timeVal = f['visitedAt'] ?? f['time']
          const time = typeof timeVal === 'string' ? timeVal : undefined
          const mapColor = typeof f['mapColor'] === 'string' ? f['mapColor'] : undefined

          travelData[provinceName] = {
            isVisited: Boolean(f['mapHighlight']) || Boolean(f.province),
            cities: cityName ? [{ name: cityName, time }] : [],
            mapColor,
          }
        }

        // 如果没有 Sanity 数据，保留少量默认值以保证示例显示
        if (Object.keys(travelData).length === 0) {
          travelData['四川'] = { isVisited: true, cities: [{ name: '康定市-贡嘎小环线', time: '2025-08' }] }
          travelData['陕西'] = { isVisited: true, cities: [{ name: '西安市-终南山', time: '2024-12' }] }
        }

        const seriesData: Array<Record<string, unknown>> = []
        let visitedCount = 0
        let citiesCount = 0

        // 获取当前页面背景色（每次调用都读取 document.body），优先使用 Sanity 的 mapColor
        const getPageBgHex = () => {
          try {
            const el = document.body
            const bg = getComputedStyle(el).backgroundColor
            if (!bg) return '#10b981'
            const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
            if (m) {
              const r = parseInt(m[1], 10)
              const g = parseInt(m[2], 10)
              const b = parseInt(m[3], 10)
              return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
            }
          } catch (e) {
            // ignore
          }
          return '#10b981'
        }

        for (const [name, data] of Object.entries(travelData)) {
          const value = data.isVisited ? 1 : 0
          if (value === 1) visitedCount++
          citiesCount += (data.cities || []).length
          const entry: Record<string, unknown> = { name, value, cities: data.cities || [] }
          if (value === 1) {
            // 已访问：优先使用 Sanity 指定的颜色，否则使用页面 background（实时读取）
            const color = data.mapColor || getPageBgHex()
            entry.itemStyle = { areaColor: color }
          }
          seriesData.push(entry)
        }

        // originalSeriesData previously used for dynamic color updates; removed to satisfy lint

        const option = {
          backgroundColor: "transparent",
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: 8,
            textStyle: { color: '#111827' },
            borderWidth: 0,
            extraCssText: 'box-shadow: 0 6px 18px rgba(0,0,0,0.08); border-radius:6px; white-space:pre-line;',
            formatter: function (params: unknown) {
              const p = params as { name?: string; data?: unknown }
              const d = (p.data ?? {}) as { cities?: Array<{ name?: string; time?: string }> }
              const cities = Array.isArray(d.cities) ? d.cities.map(c => `${c.name ?? ''}${c.time ? ' • ' + c.time : ''}`).join('\n') : ''
              return `${p.name ?? ''}${cities ? ('\n' + cities) : ''}`
            }
          },
          visualMap: {
            show: false,
            min: 0,
            max: 1,
            inRange: { color: ['#ffffff', '#10b981'] }
          },
          series: [
            {
              name: 'footprints',
              type: 'map',
              map: 'china',
              roam: false,
              zoom: 1.5,
              center: [108.95, 36.27],
              label: {
                show: true,
                color: '#6b7280',
                formatter: function (params: unknown) {
                  const p = params as { name?: string }
                  return String(p.name || '').replace(/(省|市|自治区|特别行政区|回族自治区|维吾尔自治区|壮族自治区|自治州|州|盟|地区|县|区)$/u, '')
                }
              },
              labelLayout: { hideOverlap: true },
              itemStyle: { areaColor: '#f3f4f6', borderColor: '#ffffff' },
              emphasis: { label: { color: '#111827' }, itemStyle: { areaColor: '#a7f3d0' } },
              data: seriesData,
            },
          ],
        }

        chart.setOption(option)

        const totalProvinces = (geo.features && Array.isArray(geo.features) && geo.features.length) || 34
        setCounts({ visited: visitedCount, total: totalProvinces, cities: citiesCount })

        try {
          const el = containerRef.current
          if (el) {
            const r = el.getBoundingClientRect()
            setDebugState(s => ({ ...s, containerW: Math.round(r.width), containerH: Math.round(r.height) }))
          }
        } catch (e) {}

        const onResize = () => chart.resize()
        window.addEventListener("resize", onResize)

        // cleanup
        return () => {
          window.removeEventListener("resize", onResize)
          chart.dispose()
        }
      } else {
        // 无效的 geojson 时中断
        try { setDebugState(s => ({ ...s, geoError: 'invalid geojson' })) } catch (e) {}
        return
      }
    }

      const cleanPromise: Promise<(() => void) | void> = init()

    return () => {
      disposed = true
      // allow inited promise to cleanup via its return if needed
      cleanPromise.then((fn: unknown) => {
        if (typeof fn === 'function') (fn as () => void)()
      }).catch(() => {})
    }
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">人生足迹</h2>
        <p className="text-gray-600">记录走过的每一个地方</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <div style={{ overflow: 'hidden' }}>
          <div ref={containerRef} style={{ width: 'calc(100% + 40px)', height: 650, transform: 'translateX(40px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: 12, top: 12, background: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', padding: '8px 10px', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>地图调试</div>
              <div>echarts: {String(debugState.echartsLoaded)}</div>
              <div>geoJSON: {String(debugState.geoLoaded)}</div>
              {debugState.geoError ? <div>geoErr: {debugState.geoError}</div> : null}
              {debugState.echartsError ? <div>echartsErr: {debugState.echartsError}</div> : null}
              <div>footprints: {debugState.footprintsCount}</div>
              <div>chart: {String(debugState.chartInit)}</div>
              <div>size: {debugState.containerW}×{debugState.containerH}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-center border-t border-gray-200 pt-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-gray-500 font-semibold">Provinces Visited</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{counts.visited} / {counts.total}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-gray-500 font-semibold">Cities/Places Visited</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{counts.cities}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
