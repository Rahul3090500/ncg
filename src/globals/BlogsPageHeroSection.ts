import type { GlobalConfig } from 'payload'

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