import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const TrustedBySection: GlobalConfig = {
  slug: 'trusted-by-section',
  label: 'Trusted By Section',
  admin: {
    group: 'Homepage',
    description: 'Manage trusted by / clients section',
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
      name: 'overline',
      type: 'text',
      required: true,
      defaultValue: 'our clients',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Trusted by Industry Leaders',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Helping banks, fintechs, governments, and global enterprises stay secure',
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Client Logos',
      minRows: 0,
      maxRows: 20,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

