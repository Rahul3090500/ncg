import type { GlobalConfig } from 'payload'

export const CareerStatsSection: GlobalConfig = {
  slug: 'career-stats',
  label: 'Career Stats',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page statistics section',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Things we are proud of:',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

