import type { GlobalConfig } from 'payload'

export const CareerJobSection: GlobalConfig = {
  slug: 'career-job-section',
  label: 'Career Job Section',
  admin: {
    group: 'Career Page',
    description: 'Manage job openings section - heading, CTA, and select 3 featured jobs',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: true,
      defaultValue: 'Check out our job openings',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'CTA Button Text',
      required: true,
      defaultValue: 'View All',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'CTA Button Link',
      required: true,
      defaultValue: '/career',
    },
    {
      name: 'selectedJobs',
      type: 'relationship',
      relationTo: 'job-openings',
      label: 'Featured Jobs',
      hasMany: true,
      admin: {
        description: 'Select exactly 3 jobs to display in this section',
      },
      validate: (value) => {
        if (Array.isArray(value) && value.length > 3) {
          return 'Select up to 3 jobs'
        }
        return true
      },
    },
  ],
}

