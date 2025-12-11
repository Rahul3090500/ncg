import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const AboutHeroSection: GlobalConfig = {
  slug: 'about-hero',
  label: 'About Hero',
  admin: {
    group: 'About Page',
    description: 'Manage About page hero content',
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
      name: 'quote',
      type: 'textarea',
      required: true,
      defaultValue:
        "At Nordic Cyber Group, we don't just defend against cyber threats—we build the trust, resilience, and strategies that keep your business moving forward, no matter what.",
    },
    {
      name: 'highlightWords',
      type: 'textarea',
      label: 'Highlight Words/Phrases',
      admin: {
        description: 'Enter words or phrases to highlight in blue (text-blue-400). Separate multiple items with commas. Example: excellence, innovation, trust',
        placeholder: 'excellence, innovation, trust',
      },
      defaultValue: '',
    },
    {
      name: 'attribution',
      type: 'text',
      required: true,
      defaultValue: 'NCG TEAM',
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Video',
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      required: true,
      defaultValue: 0.6,
    },
  ],
}