import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const ApproachSection: GlobalConfig = {
  slug: 'approach-section',
  label: 'Approach Section',
  admin: {
    group: 'Homepage',
    description: 'Manage our approach section',
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
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Approach',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Embracing the power of simplified cybersecurity',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        "In an era where digital threats morph and expand daily, we answer not by complicating our defences, but by simplifying them. We're pioneering a shift: redefining cybersecurity for tomorrow's challenges.",
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'Contact Us',
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
      defaultValue: '/contact',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Approach Steps',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            description: 'Step number (e.g., "01", "02")',
          },
        },
        {
          name: 'title',
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
        },
      ],
    },
  ],
}

