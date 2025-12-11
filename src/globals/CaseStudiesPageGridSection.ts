import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CaseStudiesPageGridSection: GlobalConfig = {
  slug: 'case-studies-page-grid',
  label: 'Case Studies Page Grid',
  admin: {
    group: 'Case Studies',
    description: 'Select case studies to display on the Case Studies page',
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
    },
  ],
}