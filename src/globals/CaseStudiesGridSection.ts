import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CaseStudiesGridSection: GlobalConfig = {
  slug: 'case-studies-grid',
  label: 'Case Studies Grid',
  admin: {
    group: 'Homepage',
    description: 'Manage case studies cards',
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
      name: 'selectedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      admin: {
        description: 'Select up to 3 case studies to feature on the homepage',
      },
      validate: (value) => {
        if (Array.isArray(value) && value.length > 3) return 'Select up to 3 case studies'
        return true
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'All Case Studies',
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
      defaultValue: '/case-studies',
    },
  ],
}

