import type { GlobalConfig } from 'payload'

export const FooterSection: GlobalConfig = {
  slug: 'footer-section',
  label: 'Footer',
  admin: {
    group: 'Footer',
    description: 'Manage footer contact and office information',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'contactUs',
      type: 'group',
      label: 'Contact Us',
      fields: [
        {
          name: 'phoneHeading',
          type: 'text',
          required: true,
          defaultValue: 'Phone:',
        },
        {
          name: 'phone',
          type: 'group',
          label: 'Phone Numbers',
          fields: [
            {
              name: 'sweden',
              type: 'text',
              required: true,
              defaultValue: 'Sweden: +46-732-442-583',
            },
            {
              name: 'denmark',
              type: 'text',
              required: true,
              defaultValue: 'Denmark: +12 34 45 67 80',
            },
          ],
        },
        {
          name: 'emailHeading',
          type: 'text',
          required: true,
          defaultValue: 'Email:',
        },
        {
          name: 'email',
          type: 'text',
          required: true,
          defaultValue: 'info@ncgrp.se',
        },
      ],
    },
    {
      name: 'followUs',
      type: 'group',
      label: 'Follow Us',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Follow Us',
        },
      ],
    },
    {
      name: 'bottomBar',
      type: 'group',
      label: 'Bottom Bar',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          required: true,
          defaultValue: '© 2025 Nordic Cyber Group',
        },
        {
          name: 'privacyLabel',
          type: 'text',
          required: true,
          defaultValue: 'Privacy Policy',
        },
        {
          name: 'privacyHref',
          type: 'text',
          required: true,
          defaultValue: '/privacy',
        },
      ],
    },
    {
      name: 'sweden',
      type: 'group',
      label: 'Sweden',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Sweden',
        },
        {
          name: 'officeHeading',
          type: 'text',
          required: true,
          defaultValue: 'Head Office Stockholm',
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
          defaultValue: 'Kungsbro Strand 29, 112 26',
        },
        {
          name: 'addressLine2',
          type: 'text',
          required: true,
          defaultValue: 'Stockholm, Sweden',
        },
      ],
    },
    {
      name: 'malmo',
      type: 'group',
      label: 'Malmo',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Malmo',
        },
        {
          name: 'officeHeading',
          type: 'text',
          required: true,
          defaultValue: 'Branch Office',
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
          defaultValue: 'Torggatan 4, Seventh Floor',
        },
        {
          name: 'addressLine2',
          type: 'text',
          required: true,
          defaultValue: '211 40 Malmo',
        },
      ],
    },
  ],
}