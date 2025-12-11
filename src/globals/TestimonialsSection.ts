import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const TestimonialsSection: GlobalConfig = {
  slug: 'testimonials-section',
  label: 'Testimonials Section',
  admin: {
    group: 'Homepage',
    description: 'Manage client testimonials',
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
      name: 'overline',
      type: 'text',
      required: true,
      defaultValue: 'client testimonials',
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}

