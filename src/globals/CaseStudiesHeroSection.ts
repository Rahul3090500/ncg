import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CaseStudiesHeroSection: GlobalConfig = {
  slug: 'case-studies-hero',
  label: 'Case Studies Hero',
  admin: {
    group: 'Homepage',
    description: 'Manage case studies hero section',
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
      defaultValue: 'case studies',
    },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue: 'Real Results.\nProven Security.',
      admin: {
        description: 'Use \\n for line breaks',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
  ],
}

