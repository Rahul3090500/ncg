import type { GlobalConfig } from 'payload'

export const AboutStatsSection: GlobalConfig = {
  slug: 'about-stats-section',
  label: 'About Stats Section',
  admin: {
    group: 'About Page',
    description: 'Manage About page statistics',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}