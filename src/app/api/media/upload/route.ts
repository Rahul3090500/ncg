import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Readable } from 'stream'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a Readable stream from Buffer (Payload expects a stream)
    const stream = Readable.from(buffer)

    // Create file object in the format Payload expects
    const fileData = {
      data: stream,
      name: file.name,
      mimetype: file.type || 'application/octet-stream',
      size: file.size,
    }

    // Create media document using Payload's file upload format
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name,
      },
      file: fileData,
    })

    return NextResponse.json({ success: true, doc: media })
  } catch (error: any) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

