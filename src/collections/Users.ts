import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
