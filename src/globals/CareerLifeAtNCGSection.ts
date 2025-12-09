import type { GlobalConfig } from 'payload'

export const CareerLifeAtNCGSection: GlobalConfig = {
  slug: 'career-life-at-ncg',
  label: 'Career Life at NCG',
  admin: {
    group: 'Career Page',
    description: 'Manage Career page "Life at NCG" image gallery section',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Center Text',
      defaultValue: 'Life at NCG',
      admin: {
        description: 'Text displayed in the center overlay',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Real Stories, Real People',
      admin: {
        description: 'Subtitle displayed below the main text',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Gallery Images',
      minRows: 11,
      maxRows: 11,
      admin: {
        description: 'Upload exactly 11 images. Layout: Row 1 (3 images), Row 2 (4 images with center overlay), Row 3 (4 images with last one cut off)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

