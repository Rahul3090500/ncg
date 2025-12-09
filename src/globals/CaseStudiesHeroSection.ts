import type { GlobalConfig } from 'payload'

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

