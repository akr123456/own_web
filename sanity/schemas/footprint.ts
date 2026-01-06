import { defineField, defineType } from 'sanity'

import { Layers3Icon } from '~/assets'

export default defineType({
  name: 'footprint',
  title: '足迹',
  type: 'document',
  icon: Layers3Icon,
  fields: [
    defineField({
      name: 'name',
      title: '名字',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'province',
      title: '省/直辖市（用于地图高亮，填写中文名称）',
      type: 'string',
      description: '例如：四川、陕西、广东。用于地图上高亮对应省份。',
    }),
    defineField({
      name: 'city',
      title: '城市/地点',
      type: 'string',
    }),
    defineField({
      name: 'visitedAt',
      title: '到访时间',
      type: 'date',
      description: '填写到访时间（可为空）。',
    }),
    defineField({
      name: 'mapHighlight',
      title: '在地图上高亮',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'mapColor',
      title: '地图高亮颜色（可选，CSS 颜色）',
      type: 'string',
      description: '可填写类似 #10b981 或 green，若为空使用默认绿色。',
    }),
    defineField({
      name: 'url',
      title: '链接',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: '图片',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
