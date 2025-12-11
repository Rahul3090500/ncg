import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const Icons: CollectionConfig = {
  slug: 'icons',
  labels: {
    singular: 'Icon',
    plural: 'Icons',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'name',
    description: 'Upload SVG icons and reuse them across case studies',
  },
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'svg',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}