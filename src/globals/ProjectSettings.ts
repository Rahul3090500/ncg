import type { GlobalConfig } from 'payload'
import { invalidateCacheAfterGlobalChange } from '../hooks/payload'

export const ProjectSettings: GlobalConfig = {
  slug: 'project-settings',
  label: 'Project Settings',
  admin: {
    group: 'Settings',
    description: 'Manage global project settings including SEO, favicons, social media, and advanced metadata',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basic SEO',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              required: false,
              admin: {
                description: 'Default site title (used in <title> tag and as fallback for OG title)',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Default site description (used in meta description and as fallback for OG description). Recommended: 150-160 characters',
              },
            },
            {
              name: 'siteKeywords',
              type: 'text',
              required: false,
              admin: {
                description: 'Comma-separated keywords for meta keywords tag',
              },
            },
            {
              name: 'siteAuthor',
              type: 'text',
              required: false,
              admin: {
                description: 'Site author name',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: false,
              admin: {
                description: 'Canonical site URL (e.g., https://www.example.com). Used for canonical URLs and Open Graph tags',
              },
            },
            {
              name: 'siteLanguage',
              type: 'text',
              required: false,
              defaultValue: 'en',
              admin: {
                description: 'Site language code (e.g., en, en-US). Default: en',
              },
            },
          ],
        },
        {
          label: 'Favicons',
          fields: [
            {
              name: 'favicon16x16',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Favicon 16x16 pixels (.ico or .png format)',
              },
            },
            {
              name: 'favicon32x32',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Favicon 32x32 pixels (.ico or .png format)',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Apple Touch Icon 180x180 pixels (for iOS devices)',
              },
            },
            {
              name: 'androidChrome192x192',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Android Chrome icon 192x192 pixels',
              },
            },
            {
              name: 'androidChrome512x512',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Android Chrome icon 512x512 pixels',
              },
            },
            {
              name: 'faviconThemeColor',
              type: 'text',
              required: false,
              admin: {
                description: 'Theme color for browser UI (hex color, e.g., #488BF3)',
              },
            },
          ],
        },
        {
          label: 'Open Graph',
          fields: [
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Default Open Graph image (recommended: 1200x630 pixels). Used when page-specific OG image is not set',
              },
            },
            {
              name: 'ogTitle',
              type: 'text',
              required: false,
              admin: {
                description: 'Default Open Graph title (falls back to site title if not set)',
              },
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Default Open Graph description (falls back to site description if not set). Recommended: 200 characters',
              },
            },
            {
              name: 'ogType',
              type: 'select',
              required: false,
              defaultValue: 'website',
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Article', value: 'article' },
                { label: 'Profile', value: 'profile' },
                { label: 'Business', value: 'business.business' },
              ],
              admin: {
                description: 'Default Open Graph type',
              },
            },
            {
              name: 'ogSiteName',
              type: 'text',
              required: false,
              admin: {
                description: 'Site name for Open Graph (falls back to site title if not set)',
              },
            },
            {
              name: 'ogLocale',
              type: 'text',
              required: false,
              defaultValue: 'en_US',
              admin: {
                description: 'Open Graph locale (e.g., en_US, en_GB). Default: en_US',
              },
            },
          ],
        },
        {
          label: 'Twitter Card',
          fields: [
            {
              name: 'twitterCardType',
              type: 'select',
              required: false,
              defaultValue: 'summary_large_image',
              options: [
                { label: 'Summary', value: 'summary' },
                { label: 'Summary Large Image', value: 'summary_large_image' },
                { label: 'App', value: 'app' },
                { label: 'Player', value: 'player' },
              ],
              admin: {
                description: 'Twitter Card type',
              },
            },
            {
              name: 'twitterSite',
              type: 'text',
              required: false,
              admin: {
                description: 'Twitter site handle (e.g., @yourcompany - without @ symbol)',
              },
            },
            {
              name: 'twitterCreator',
              type: 'text',
              required: false,
              admin: {
                description: 'Twitter creator handle (e.g., @yourname - without @ symbol)',
              },
            },
            {
              name: 'twitterImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Default Twitter Card image (recommended: 1200x600 pixels). Falls back to OG image if not set',
              },
            },
          ],
        },
        {
          label: 'Verification & Analytics',
          fields: [
            {
              name: 'googleVerification',
              type: 'text',
              required: false,
              admin: {
                description: 'Google Search Console verification code (content value from meta tag)',
              },
            },
            {
              name: 'bingVerification',
              type: 'text',
              required: false,
              admin: {
                description: 'Bing Webmaster Tools verification code',
              },
            },
            {
              name: 'yandexVerification',
              type: 'text',
              required: false,
              admin: {
                description: 'Yandex Webmaster verification code',
              },
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
              required: false,
              admin: {
                description: 'Google Analytics ID (e.g., G-XXXXXXXXXX for GA4 or UA-XXXXXXXXX-X for Universal Analytics)',
              },
            },
            {
              name: 'googleTagManagerId',
              type: 'text',
              required: false,
              admin: {
                description: 'Google Tag Manager Container ID (e.g., GTM-XXXXXXX)',
              },
            },
            {
              name: 'facebookPixelId',
              type: 'text',
              required: false,
              admin: {
                description: 'Facebook Pixel ID',
              },
            },
            {
              name: 'linkedInInsightTag',
              type: 'text',
              required: false,
              admin: {
                description: 'LinkedIn Insight Tag ID',
              },
            },
          ],
        },
        {
          label: 'Robots & Sitemap',
          fields: [
            {
              name: 'robotsContent',
              type: 'textarea',
              required: false,
              defaultValue: 'User-agent: *\nAllow: /',
              admin: {
                description: 'robots.txt content. Default: Allow all crawlers to access all pages',
              },
            },
            {
              name: 'defaultRobotsMeta',
              type: 'select',
              required: false,
              defaultValue: 'index,follow',
              options: [
                { label: 'Index, Follow', value: 'index,follow' },
                { label: 'Index, No Follow', value: 'index,nofollow' },
                { label: 'No Index, Follow', value: 'noindex,follow' },
                { label: 'No Index, No Follow', value: 'noindex,nofollow' },
              ],
              admin: {
                description: 'Default robots meta tag for pages',
              },
            },
            {
              name: 'sitemapUrl',
              type: 'text',
              required: false,
              admin: {
                description: 'Sitemap URL (e.g., https://www.example.com/sitemap.xml)',
              },
            },
          ],
        },
        {
          label: 'Structured Data',
          fields: [
            {
              name: 'organizationName',
              type: 'text',
              required: false,
              admin: {
                description: 'Organization name for schema.org structured data',
              },
            },
            {
              name: 'organizationLogo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Organization logo for schema.org structured data',
              },
            },
            {
              name: 'organizationUrl',
              type: 'text',
              required: false,
              admin: {
                description: 'Organization website URL for schema.org',
              },
            },
            {
              name: 'organizationContactPoint',
              type: 'group',
              fields: [
                {
                  name: 'contactType',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Contact type (e.g., customer service, technical support)',
                  },
                },
                {
                  name: 'telephone',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Contact telephone number',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  required: false,
                  admin: {
                    description: 'Contact email address',
                  },
                },
              ],
            },
            {
              name: 'organizationSocialLinks',
              type: 'array',
              label: 'Social Media Links',
              required: false,
              admin: {
                description: 'Add organization social media profiles for schema.org',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Platform name (e.g., Facebook, Twitter, LinkedIn)',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Social media profile URL',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced Meta Tags',
          fields: [
            {
              name: 'additionalMetaTags',
              type: 'array',
              label: 'Custom Meta Tags',
              required: false,
              admin: {
                description: 'Add custom meta tags (e.g., viewport, theme-color, etc.)',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Meta tag name or property',
                  },
                },
                {
                  name: 'content',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Meta tag content value',
                  },
                },
              ],
            },
            {
              name: 'canonicalUrlBase',
              type: 'text',
              required: false,
              admin: {
                description: 'Base URL for canonical tags (if different from siteUrl)',
              },
            },
          ],
        },
      ],
    },
  ],
}
