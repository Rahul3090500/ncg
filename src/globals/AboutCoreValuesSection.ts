import type { GlobalConfig } from 'payload'

export const AboutCoreValuesSection: GlobalConfig = {
  slug: 'about-core-values-section',
  label: 'About Core Values Section',
  admin: {
    group: 'About Page',
    description: 'Manage core values cards',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Our Core Values' },
    { name: 'subtitle', type: 'text', required: true, defaultValue: 'Complete honesty and transparency' },
    {
      name: 'values',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: { equals: 'image/svg+xml' },
          },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}