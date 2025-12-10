import type { GlobalConfig } from 'payload'

export const AboutUsSection: GlobalConfig = {
  slug: 'about-us-section',
  label: 'About Us Section',
  admin: {
    group: 'About Page',
    description: 'Manage About Us content and image',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'sectionLabel', type: 'text', required: true, defaultValue: 'ABOUT US' },
    { name: 'heading', type: 'text', required: true, defaultValue: 'Securing digital futures, one Organization at a Time' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'paragraphs',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}