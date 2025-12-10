import type { GlobalConfig } from 'payload'

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
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      required: true,
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

