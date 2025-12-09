import { NextResponse } from 'next/server'
import { getCareerPageData } from '@/lib/payload-career'

export async function GET() {
  try {
    const data = await getCareerPageData()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching career page data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch career page data' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

