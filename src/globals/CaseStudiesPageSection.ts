import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CaseStudiesPageSection: GlobalConfig = {
  slug: 'case-studies-page',
  label: 'Case Studies Page',
  admin: {
    group: 'Case Studies Page',
    description: 'Manage hero and grid for the Case Studies page',
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
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'overline', type: 'text', required: true, defaultValue: 'case studies' },
        { name: 'heading', type: 'textarea', required: true, defaultValue: 'Real Results.\nProven Security.' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'introText', type: 'textarea', required: true, defaultValue: "At NCG, we pride ourselves on delivering tailored, high-impact cybersecurity solutions. These case studies showcase how we've addressed complex challenges and delivered measurable value to industry leaders." },
      ],
    },
    {
      name: 'grid',
      type: 'group',
      fields: [
        { name: 'selectedCaseStudies', type: 'relationship', relationTo: 'case-studies', hasMany: true },
      ],
    },
  ],
}