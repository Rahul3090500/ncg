import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const BlogsPageHeroSection: GlobalConfig = {
  slug: 'blogs-page-hero',
  label: 'Blogs Page Hero',
  admin: {
    group: 'Blogs Page',
    description: 'Hero content for the Blogs page',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterGlobalChange],
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue: 'Knowledge Hub',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}