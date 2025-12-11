import type { CollectionConfig } from 'payload'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { invalidateCacheAfterChange, invalidateCacheAfterDelete } from '../hooks/payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true, // Allow public uploads for job applications
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
  hooks: {
    afterChange: [invalidateCacheAfterChange],
    afterDelete: [
      async (args: any) => {
        const doc = args?.doc || {}
        const s3Bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || 'ncg-storage-bucket'
        const s3Region = process.env.S3_REGION || process.env.AWS_REGION || ''
        const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || ''
        const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''
        const s3Endpoint = process.env.S3_ENDPOINT
        const s3ForcePathStyle = (process.env.S3_FORCE_PATH_STYLE || '').trim() === 'true'
        if (!s3Bucket || !s3Region || !s3AccessKeyId || !s3SecretAccessKey) return
        const client = new S3Client({
          region: s3Region,
          credentials: { accessKeyId: s3AccessKeyId, secretAccessKey: s3SecretAccessKey },
          ...(s3Endpoint ? { endpoint: s3Endpoint } : {}),
          ...(s3ForcePathStyle ? { forcePathStyle: true } : {}),
        })
        const url = typeof doc?.url === 'string' ? doc.url : ''
        let key = ''
        if (url) {
          try {
            const u = new URL(url)
            key = u.pathname.replace(/^\//, '')
          } catch {}
        }
        if (!key) {
          const prefix = (process.env.S3_PREFIX || '').trim()
          const filename = (doc?.filename || doc?.file?.filename || '').trim()
          if (!filename) return
          key = prefix ? `${prefix}/${filename}` : filename
        }
        await client.send(new DeleteObjectCommand({ Bucket: s3Bucket, Key: key }))
      },
      invalidateCacheAfterDelete,
    ],
  },
}
