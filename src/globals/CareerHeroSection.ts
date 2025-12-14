import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CareerHeroSection: GlobalConfig = {
  slug: 'career-hero',
  label: 'Career Hero',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page hero section',
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
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Desktop)',
      required: true,
      admin: {
        description: 'Background image for desktop view',
      },
    },
    {
      name: 'backgroundImageMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Mobile/Tablet)',
      required: false,
      admin: {
        description: 'Background image for mobile and tablet view',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Why Work with Us',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      defaultValue: 'At NCG, we believe that cybersecurity is about more than just systems—it\'s about people.',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Join a team where your ideas matter, collaboration is encouraged, and professional growth is a priority.',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'View Job Openings',
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
      defaultValue: '#job-openings',
    },
  ],
}

