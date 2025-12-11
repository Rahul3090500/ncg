import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const JobsSection: GlobalConfig = {
  slug: 'jobs-section',
  label: 'Jobs Section',
  admin: {
    group: 'Jobs',
    description: 'Manage Jobs page - background image, heading, description, and select jobs to display',
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
      label: 'Background Image',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Page Heading',
      required: true,
      defaultValue: 'All Job Openings',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Page Description',
      required: true,
      defaultValue: 'Explore exciting opportunities at NCG and become part of a team dedicated to building resilience, protecting data, and shaping the future of cybersecurity.',
    },
    {
      name: 'selectedJobs',
      type: 'relationship',
      relationTo: 'job-openings',
      label: 'Jobs to Display',
      hasMany: true,
      admin: {
        description: 'Select which jobs to display on the Jobs page',
      },
    },
  ],
}

