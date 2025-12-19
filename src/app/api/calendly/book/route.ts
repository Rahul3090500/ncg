import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 0

interface BookingRequest {
  eventTypeUrl: string
  startTime: string
  endTime: string
  inviteeEmail: string
  inviteeFirstName?: string
  inviteeLastName?: string
  inviteePhoneNumber?: string
  questionsAndAnswers?: Array<{
    question: string
    answer: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    const {
      eventTypeUrl,
      startTime,
      endTime,
      inviteeEmail,
      inviteeFirstName,
      inviteeLastName,
      inviteePhoneNumber,
      questionsAndAnswers,
    } = body

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
        { error: 'Invalid event type URL' },
        { status: 400 }
      )
    }

    const [, username, eventTypeSlug] = urlMatch

    // Get the event type URI
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
        { error: 'Failed to fetch event type' },
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

    // Create scheduling link (Calendly API v2 uses scheduling links)
    const schedulingLinkResponse = await fetch(
      'https://api.calendly.com/scheduling_links',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${calendlyApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: eventType.owner,
          owner_type: 'EventType',
          max_event_count: 1,
        }),
      }
    )

    if (!schedulingLinkResponse.ok) {
      const error = await schedulingLinkResponse.text()
      console.error('Calendly scheduling link error:', error)
      return NextResponse.json(
        { error: 'Failed to create scheduling link' },
        { status: schedulingLinkResponse.status }
      )
    }

    const schedulingLinkData = await schedulingLinkResponse.json()

    // Note: Calendly API doesn't directly support programmatic booking creation
    // The best approach is to redirect to the scheduling link or use webhooks
    // For now, we'll return the scheduling link URL
    return NextResponse.json({
      scheduling_link: schedulingLinkData.resource.booking_url,
      message: 'Please use the scheduling link to complete your booking',
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Calendly API error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating Calendly booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
