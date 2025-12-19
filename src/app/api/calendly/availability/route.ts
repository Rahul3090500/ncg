import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 0

interface AvailabilityRequest {
  eventTypeUrl: string
  startTime?: string
  endTime?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AvailabilityRequest = await request.json()
    const { eventTypeUrl, startTime, endTime } = body

    const calendlyApiToken = process.env.CALENDLY_API_TOKEN

    if (!calendlyApiToken) {
      return NextResponse.json(
        { error: 'Calendly API token not configured' },
        { status: 500 }
      )
    }

    // Extract username and event type slug from URL
    const urlMatch = eventTypeUrl.match(/calendly\.com\/([^/]+)\/([^/?]+)/)
    if (!urlMatch) {
      return NextResponse.json(
        { error: 'Invalid event type URL. Expected format: https://calendly.com/username/event-type' },
        { status: 400 }
      )
    }

    const [, username, eventTypeSlug] = urlMatch

    // First, get the event type UUID
    const eventTypesResponse = await fetch(
      `https://api.calendly.com/event_types?user=${encodeURIComponent(`https://api.calendly.com/users/${username}`)}`,
      {
        headers: {
          Authorization: `Bearer ${calendlyApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!eventTypesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch event types' },
        { status: eventTypesResponse.status }
      )
    }

    const eventTypesData = await eventTypesResponse.json()
    const eventType = eventTypesData.collection?.find(
      (et: any) => et.slug === eventTypeSlug
    )

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type not found' },
        { status: 404 }
      )
    }

    // Build availability query
    const params = new URLSearchParams({
      event_type: eventType.uri,
    })

    if (startTime) params.append('start_time', startTime)
    if (endTime) params.append('end_time', endTime)

    // Fetch availability from Calendly API
    const response = await fetch(
      `https://api.calendly.com/event_type_available_times?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${calendlyApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Calendly API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Calendly availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
