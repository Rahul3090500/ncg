import type { GlobalConfig } from 'payload'

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
  fields: [
    {
      name: 'selectedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
    },
  ],
}