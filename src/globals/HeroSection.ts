import type { GlobalConfig } from 'payload'

export const HeroSection: GlobalConfig = {
  slug: 'hero-section',
  label: 'Hero Section',
  admin: {
    group: 'Homepage',
    description: 'Manage homepage hero section content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'mainHeading',
      type: 'textarea',
      required: true,
      label: 'Main Heading',
      admin: {
        description: 'Use \\n for line breaks',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (Legacy)',
      admin: {
        description: 'Fallback background image. Use "Animated Background Images" below for dynamic backgrounds.',
      },
    },
    {
      name: 'animatedTexts',
      type: 'array',
      label: 'Animated Texts',
      minRows: 0,
      admin: {
        description: 'Texts that will be typed and deleted in sequence. Each text corresponds to a background image.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Text',
        },
      ],
    },
    {
      name: 'backgroundImages',
      type: 'array',
      label: 'Animated Background Images',
      minRows: 0,
      admin: {
        description: 'Background images that change with each animated text. Order should match the animated texts above.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'callToAction',
      type: 'group',
      label: 'Call to Action Box',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'ctaHeading',
          type: 'textarea',
          required: true,
          label: 'CTA Heading',
          admin: {
            description: 'Use \\n for line breaks',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          required: true,
          label: 'CTA Link',
          defaultValue: '/contact',
        },
        {
          name: 'backgroundColor',
          type: 'text',
          required: true,
          label: 'Background Color',
          defaultValue: '#001D5C',
          admin: {
            description: 'Hex color code',
          },
        },
      ],
    },
  ],
}

