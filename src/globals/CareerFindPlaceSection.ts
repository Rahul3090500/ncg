import type { GlobalConfig } from 'payload'

export const CareerFindPlaceSection: GlobalConfig = {
  slug: 'career-find-place',
  label: 'Career Find Place',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page "Find Your Place at NCG" section',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Side Image',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Grow with us. Build with us. Secure the future with us.',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Find Your Place at NCG',
    },
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Content Paragraphs',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

