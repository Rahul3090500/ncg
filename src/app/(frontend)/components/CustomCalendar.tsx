'use client'

import React, { useState } from 'react'

interface TimeSlot {
  time: string
  label: string
}

interface CustomCalendarProps {
  eventTypeUrl: string
  onBookingComplete?: () => void
  className?: string
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  eventTypeUrl,
  onBookingComplete,
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generate time slots (common business hours)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM
    const interval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const date = new Date()
        date.setHours(hour, minute, 0, 0)
        const time12 = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        slots.push({
          time: time24,
          label: time12,
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (!date) return
    setSelectedDate(date)
  }

  // Handle booking - redirect to Calendly
  const handleBooking = (slot: TimeSlot) => {
    // Redirect to Calendly's free booking page
    // User will see actual availability and complete booking there
    window.open(eventTypeUrl, '_blank')
    
    // Optional: Track that user clicked to book
    onBookingComplete?.()
  }

  const days = getDaysInMonth(currentMonth)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isToday = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isPast = (date: Date | null) => {
    if (!date) return false
    return date < today
  }


  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                )
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                )
              }
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />
              }

              const isSelected =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={isPast(date)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-colors
                    ${isPast(date) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50'}
                    ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}
                  `}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Slots & Booking Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {selectedDate ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Available Times for{' '}
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleBooking(slot)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>

                <div className="border-t pt-4 text-sm text-gray-600">
                  <p>
                    Select a time slot to open Calendly and see actual availability for this date.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a date to see available times
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomCalendar
