/**
 * Media Proxy Route
 * 
 * Proxies images from S3 to avoid CORS issues and enable Next.js image optimization.
 * This route handles requests to /api/media/* and fetches the image from S3.
 */

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
// Helper function to sanitize environment variables
function sanitizeEnv(value?: string | null): string {
  return value ? value.trim() : ''
}

const s3Bucket = sanitizeEnv(process.env.S3_BUCKET) || sanitizeEnv(process.env.AWS_S3_BUCKET) || 'ncg-storage-bucket'
const s3Region = sanitizeEnv(process.env.S3_REGION) || sanitizeEnv(process.env.AWS_REGION)
const s3AccessKeyId = sanitizeEnv(process.env.S3_ACCESS_KEY_ID) || sanitizeEnv(process.env.AWS_ACCESS_KEY_ID)
const s3SecretAccessKey = sanitizeEnv(process.env.S3_SECRET_ACCESS_KEY) || sanitizeEnv(process.env.AWS_SECRET_ACCESS_KEY)
const s3Endpoint = process.env.S3_ENDPOINT
const s3ForcePathStyle = sanitizeEnv(process.env.S3_FORCE_PATH_STYLE) === 'true'

// Initialize S3 client
const s3Client = s3Bucket && s3Region && s3AccessKeyId && s3SecretAccessKey
  ? new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
      ...(s3Endpoint ? { endpoint: s3Endpoint } : {}),
      ...(s3ForcePathStyle ? { forcePathStyle: true } : {}),
    })
  : null

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!s3Client) {
      return NextResponse.json(
        { error: 'S3 not configured' },
        { status: 500 }
      )
    }

    // Reconstruct the path from the catch-all route
    const pathSegments = params.path || []
    const key = pathSegments.join('/')

    if (!key) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      )
    }

    // Get object from S3
    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: key,
    })

    const response = await s3Client.send(command)

    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Convert stream to buffer
    // AWS SDK v3 returns Body as a Readable stream
    const stream = response.Body as any
    const chunks: Buffer[] = []
    
    // Handle different stream types
    if (stream instanceof ReadableStream) {
      const reader = stream.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(Buffer.from(value))
      }
    } else if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
      // Handle async iterable streams
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk))
      }
    } else if (stream && typeof stream.on === 'function') {
      // Handle Node.js readable streams
      await new Promise<void>((resolve, reject) => {
        stream.on('data', (chunk: any) => {
          chunks.push(Buffer.from(chunk))
        })
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    } else {
      // Fallback: try to read as Uint8Array
      const arrayBuffer = await stream.transformToByteArray?.() || stream
      chunks.push(Buffer.from(arrayBuffer))
    }
    
    const buffer = Buffer.concat(chunks)

    // Determine content type
    const contentType = response.ContentType || 'application/octet-stream'

    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  } catch (error: any) {
    console.error('Error proxying media from S3:', error)
    
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch media', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}
