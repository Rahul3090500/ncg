import type { GlobalConfig } from 'payload'

export const AboutTeamSection: GlobalConfig = {
  slug: 'about-team-section',
  label: 'About Team Section',
  admin: {
    group: 'About Page',
    description: 'Manage team section and members',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Our Team' },
    { name: 'description', type: 'textarea' },
    {
      name: 'members',
      type: 'array',
      minRows: 0,
      maxRows: 20,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'bio', type: 'textarea' },
      ],
    },
  ],
}