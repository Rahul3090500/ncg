import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage all case studies used across the site',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'Auto-generated from title if left empty. Used for URL (e.g., strengthening-identity-security-compliance)',
      },
      hooks: {
        beforeChange: [
          async ({ data, req, operation, value }) => {
            if (operation === 'create' || operation === 'update') {
              if (value && typeof value === 'string' && value.trim() !== '') {
                const baseSlug = value
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'case-studies',
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
                const baseSlug = data.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                if (req?.payload) {
                  const currentId = data?.id
                  const existing = await req.payload.find({
                    collection: 'case-studies',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Card Image',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'iconType',
      type: 'select',
      options: [
        { label: 'Real Estate', value: 'realEstate' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
      ],
      required: false,
      admin: {
        condition: (_: unknown, siblingData: any) => !siblingData?.icon,
      },
      validate: (value: any, { siblingData }: any) => {
        if (value && siblingData?.icon) return 'Choose either Icon Type or Custom Icon.'
        return true
      },
    },
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'icons',
      hasMany: false,
      required: false,
      admin: {
        condition: (_: unknown, siblingData: any) => !siblingData?.iconType,
      },
      validate: (value: any, { siblingData }: any) => {
        if (value && siblingData?.iconType) return 'Choose either Icon Type or Custom Icon.'
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Short Description',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Legacy Link (Optional)',
      admin: {
        description: 'Old link field for backward compatibility',
      },
    },
    // Hero Section Fields
    {
      name: 'heroBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hero Background Image',
    },
    {
      name: 'heroLogo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hero Logo (Client Logo)',
    },
    {
      name: 'introDescription',
      type: 'textarea',
      required: false,
      label: 'Hero Intro Description',
      admin: {
        description: 'Description shown in hero section below title',
      },
    },
    {
      name: 'solutionTags',
      type: 'array',
      required: false,
      label: 'Solution Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    // Client Overview
    {
      name: 'clientOverview',
      type: 'group',
      label: 'Client Overview',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          required: false,
        },
        {
          name: 'industry',
          type: 'text',
          required: false,
        },
        {
          name: 'location',
          type: 'text',
          required: false,
        },
        {
          name: 'size',
          type: 'text',
          required: false,
        },
      ],
    },
    // Challenges Section
    {
      name: 'challenges',
      type: 'group',
      label: 'Challenges Faced By Client',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          defaultValue: 'Challenges Faced By Client',
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'challengeItems',
          type: 'array',
          required: false,
          label: 'Challenge List Items',
          fields: [
            {
              name: 'challenge',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    // How NCG Helped Section
    {
      name: 'howNCGHelped',
      type: 'group',
      label: 'How NCG Helped',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          defaultValue: 'How NCG Helped',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: false,
        },
        {
          name: 'solutions',
          type: 'array',
          required: false,
          label: 'Solution Cards',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    // Solutions Implemented Section
    {
      name: 'solutionsImplemented',
      type: 'group',
      label: 'Solutions Implemented By NCG',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          defaultValue: 'Solutions Implemented By NCG',
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'solutionItems',
          type: 'array',
          required: false,
          label: 'Solution List Items',
          fields: [
            {
              name: 'solution',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'iconImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Icon/Graphic Image',
        },
      ],
    },
    // Value Delivered Section
    {
      name: 'valueDelivered',
      type: 'group',
      label: 'Value Delivered',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          defaultValue: 'Value Delivered',
        },
        {
          name: 'valueCards',
          type: 'array',
          required: false,
          label: 'Value Cards',
          maxRows: 3,
          fields: [
            {
              name: 'number',
              type: 'text',
              required: false,
              admin: {
                description: 'Display number (e.g., "01", "02", "03")',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}