import type { CollectionConfig } from 'payload'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const JobOpenings: CollectionConfig = {
  slug: 'job-openings',
  admin: {
    useAsTitle: 'title',
    group: 'Collections',
    description: 'Manage job opening listings',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [invalidateCacheAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'Auto-generated from title if left empty. Used for URL (e.g., cybersecurity-analyst)',
      },
      hooks: {
        beforeChange: [
          async ({ data, req, operation, value }) => {
            if (operation === 'create' || operation === 'update') {
              if (value && typeof value === 'string' && value.trim() !== '') {
                // Use provided slug, but make it URL-friendly
                const baseSlug = value
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                // Check for uniqueness
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'job-openings',
                    where: {
                      and: [
                        {
                          slug: {
                            equals: baseSlug,
                          },
                        },
                        ...(currentId ? [{
                          id: {
                            not_equals: currentId,
                          },
                        }] : []),
                      ],
                    },
                    limit: 1,
                  })
                  
                  if (existing.docs.length > 0) {
                    let counter = 1
                    let uniqueSlug = `${baseSlug}-${counter}`
                    while (existing.docs.some((doc: any) => doc.slug === uniqueSlug)) {
                      counter++
                      uniqueSlug = `${baseSlug}-${counter}`
                    }
                    return uniqueSlug
                  }
                }
                return baseSlug
              } else if (data?.title) {
                // Generate slug from title
                const baseSlug = data.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                // Check for uniqueness
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'job-openings',
                    where: {
                      and: [
                        {
                          slug: {
                            equals: baseSlug,
                          },
                        },
                        ...(currentId ? [{
                          id: {
                            not_equals: currentId,
                          },
                        }] : []),
                      ],
                    },
                    limit: 1,
                  })
                  
                  if (existing.docs.length > 0) {
                    let counter = 1
                    let uniqueSlug = `${baseSlug}-${counter}`
                    while (existing.docs.some((doc: any) => doc.slug === uniqueSlug)) {
                      counter++
                      uniqueSlug = `${baseSlug}-${counter}`
                    }
                    return uniqueSlug
                  }
                }
                return baseSlug
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-Time', value: 'full-time' },
        { label: 'Part-Time', value: 'part-time' },
        { label: 'Full-Time (Hybrid)', value: 'full-time-hybrid' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Remote', value: 'remote' },
      ],
    },
    {
      name: 'applyByDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Short Description',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hero Background Image',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Card Image',
    },
    {
      name: 'roleDescription',
      type: 'richText',
      required: false,
      label: 'Role Description (Full)',
      admin: {
        description: 'Full job description shown on detail page',
      },
    },
    {
      name: 'companyIntroduction',
      type: 'textarea',
      required: false,
      label: 'Company Introduction',
    },
    {
      name: 'responsibilities',
      type: 'array',
      required: false,
      label: 'Responsibilities',
      fields: [
        {
          name: 'responsibility',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'requiredSkills',
      type: 'array',
      required: false,
      label: 'Required Skills and Experience',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'attributes',
      type: 'array',
      required: false,
      label: 'Attributes That Set You Apart',
      fields: [
        {
          name: 'attribute',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      required: false,
      label: 'What We Offer',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'howToApply',
      type: 'textarea',
      required: false,
      label: 'How To Apply',
    },
    {
      name: 'department',
      type: 'text',
      required: false,
      label: 'Department',
    },
    {
      name: 'remoteStatus',
      type: 'select',
      required: false,
      options: [
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Remote', value: 'remote' },
        { label: 'On-Site', value: 'on-site' },
      ],
      label: 'Remote Status',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Job Detail Page Link',
      admin: {
        description: 'Optional link to the job detail page (e.g., /jobs/cybersecurity-analyst)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on Career Page',
      defaultValue: true,
    },
  ],
}

