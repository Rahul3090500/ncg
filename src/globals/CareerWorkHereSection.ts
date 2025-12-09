import type { GlobalConfig } from 'payload'

export const CareerWorkHereSection: GlobalConfig = {
  slug: 'career-work-here',
  label: 'Career Work Here',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page "What It\'s Like to Work Here" section',
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
      defaultValue: 'What It\'s Like to Work Here',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Work Here Cards',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

