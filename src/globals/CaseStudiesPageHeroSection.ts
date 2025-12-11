import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CaseStudiesPageHeroSection: GlobalConfig = {
  slug: 'case-studies-page-hero',
  label: 'Case Studies Page Hero',
  admin: {
    group: 'Case Studies Page',
    description: 'Hero content for the dedicated Case Studies page',
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
      defaultValue: 'case studies',
      required: true,
    },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Real Results.\nProven Security.',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}