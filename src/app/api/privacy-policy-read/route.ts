import { NextResponse } from 'next/server'
import { getPrivacyPolicyPageData } from '@/lib/payload'

export async function GET() {
  try {
    const data = await getPrivacyPolicyPageData()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching privacy policy page data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy page data' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

