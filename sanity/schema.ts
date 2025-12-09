import { type SchemaTypeDefinition } from 'sanity'

import { readingTimeType } from '~/sanity/schemas/types/readingTime'

import blockContent from './schemas/blockContent'
import category from './schemas/category'
import post from './schemas/post'
import project from './schemas/project'
import footprint from './schemas/footprint'
import settings from './schemas/settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [readingTimeType, post, category, blockContent, project, footprint, settings],
}
