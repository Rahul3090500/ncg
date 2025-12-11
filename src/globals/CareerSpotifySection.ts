import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const CareerSpotifySection: GlobalConfig = {
  slug: 'career-spotify',
  label: 'Career Spotify',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page Spotify section',
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
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom Icon',
      admin: {
        description: 'Upload a custom icon (SVG/PNG). If not uploaded, the default Spotify icon will be used.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Discover the NCG Soundtrack',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'We\'re more than cybersecurity—explore our culture through music. Listen to our very own track on Spotify and get a feel for the spirit that drives us forward.',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      defaultValue: 'Listen on Spotify',
    },
    {
      name: 'spotifyLink',
      type: 'text',
      required: true,
      defaultValue: 'https://spotify.com',
    },
  ],
}

