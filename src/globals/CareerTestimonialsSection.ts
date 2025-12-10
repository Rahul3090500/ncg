import type { GlobalConfig } from 'payload'

export const CareerTestimonialsSection: GlobalConfig = {
  slug: 'career-testimonials',
  label: 'Career Testimonials',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page testimonials section',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      label: 'Team Testimonials',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
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

