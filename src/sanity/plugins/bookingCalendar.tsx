'use client'

import { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { definePlugin, type Tool } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

type Booking = {
  _id: string
  userName: string
  userEmail: string
  roomName: string
  checkinDate: string
  checkoutDate: string
  adults: number
  children: number
  quantity: number
  checkedIn: boolean
  checkedOut: boolean
}

type DayBookings = {
  checkins: Booking[]
  checkouts: Booking[]
}

const QUERY = `*[_type == 'booking'] {
  _id,
  "userName": user->name,
  "userEmail": user->email,
  "roomName": hotelRoom->name,
  checkinDate,
  checkoutDate,
  adults,
  children,
  quantity,
  "checkedIn": coalesce(checkedIn, false),
  "checkedOut": coalesce(checkedOut, false)
} | order(checkinDate desc)`

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const STYLES = `
  .booking-calendar {
    padding: 24px;
    max-width: 960px;
    margin: 0 auto;
    font-family: var(--font-family-montserrat, system-ui, sans-serif);
    color: #e5e7eb;
  }
  .booking-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .booking-calendar-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
  .booking-calendar-legend {
    display: flex;
    gap: 12px;
  }
  .booking-calendar-legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #e5e7eb;
  }
  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    display: inline-block;
  }
  .legend-dot--checkin { background: #038C7F; }
  .legend-dot--checkout { background: #F27405; }

  .booking-calendar-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .booking-calendar-nav-month {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
  }
  .nav-btn {
    padding: 6px 14px;
    border: 1px solid var(--border, #D1D5DB);
    border-radius: 8px;
    background: var(--background, #fff);
    color: var(--foreground, #171717);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  .nav-btn:hover {
    background: var(--background-secondary, #eff0f2);
  }
  .nav-btn--small { font-size: 12px; }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: var(--border, #D1D5DB);
    border: 1px solid var(--border, #D1D5DB);
    border-radius: 8px;
    overflow: hidden;
  }
  .calendar-day-header {
    padding: 8px 4px;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
    background: var(--background-secondary, #eff0f2);
    color: var(--placeholder, #9CA3AF);
  }
  .calendar-cell {
    background: var(--background, #fff);
    min-height: 80px;
    padding: 6px;
    position: relative;
  }
  .calendar-cell--empty {
    background: var(--background-tertiary, #f3f4f6);
  }
  .calendar-cell--clickable { cursor: pointer; }
  .calendar-cell--clickable:hover {
    background: var(--background-secondary, #eff0f2);
  }
  .calendar-cell--selected {
    background: var(--background-secondary, #eff0f2);
  }
  .calendar-cell--today {
    border-left: 3px solid #038C7F;
  }
  .calendar-day-number {
    font-size: 13px;
    font-weight: 400;
    color: var(--foreground, #171717);
  }
  .calendar-day-number--today {
    font-weight: 700;
    color: #038C7F;
  }
  .calendar-badges {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .badge {
    font-size: 11px;
    padding: 2px 5px;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .badge--checkin {
    background: rgba(3, 140, 127, 0.15);
    color: #038C7F;
  }
  .badge--checkout {
    background: rgba(242, 116, 5, 0.15);
    color: #F27405;
  }
  .badge--all-done {
    opacity: 0.5;
  }

  .detail-panel {
    margin-top: 20px;
    border: 1px solid var(--border, #D1D5DB);
    border-radius: 8px;
    padding: 16px;
    background: var(--background, #fff);
  }
  .detail-panel h3 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
  }
  .detail-section-title {
    font-size: 14px;
    font-weight: 600;
    margin: 8px 0;
  }
  .detail-section-title--checkin { color: #038C7F; }
  .detail-section-title--checkout { color: #F27405; }

  .booking-row {
    padding: 8px 12px;
    background: var(--background-tertiary, #f3f4f6);
    border-radius: 6px;
    margin-bottom: 6px;
    font-size: 13px;
    color: var(--foreground, #171717);
  }
  .booking-row strong {
    font-weight: 600;
  }
  .booking-row-email {
    color: var(--placeholder, #9CA3AF);
    font-size: 12px;
  }
  .booking-row-meta {
    color: var(--placeholder, #9CA3AF);
    margin-left: 8px;
  }
  .booking-row--done {
    opacity: 0.5;
    text-decoration: line-through;
  }
  .booking-checkbox {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    cursor: pointer;
    accent-color: #038C7F;
    vertical-align: middle;
  }
  .booking-checkbox--checkout {
    accent-color: #F27405;
  }
`

function BookingCalendarComponent() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const fetchBookings = useCallback(() => {
    setLoading(true)
    client.fetch(QUERY).then((data: Booking[]) => {
      setBookings(data)
      setLoading(false)
    })
  }, [client])

  const toggleStatus = useCallback((bookingId: string, field: 'checkedIn' | 'checkedOut', currentValue: boolean) => {
    client.patch(bookingId).set({ [field]: !currentValue }).commit().then(() => {
      setBookings(prev => prev.map(b =>
        b._id === bookingId ? { ...b, [field]: !currentValue } : b
      ))
    })
  }, [client])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const dateMap = new Map<string, DayBookings>()
  for (const b of bookings) {
    if (b.checkinDate) {
      const existing = dateMap.get(b.checkinDate) || { checkins: [], checkouts: [] }
      existing.checkins.push(b)
      dateMap.set(b.checkinDate, existing)
    }
    if (b.checkoutDate) {
      const existing = dateMap.get(b.checkoutDate) || { checkins: [], checkouts: [] }
      existing.checkouts.push(b)
      dateMap.set(b.checkoutDate, existing)
    }
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const selectedBookings = selectedDay ? dateMap.get(selectedDay) : null
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const todayKey = formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

  return (
    <>
      <style>{STYLES}</style>
      <div className="booking-calendar">
        <div className="booking-calendar-header">
          <h1>Booking Calendar</h1>
          <div className="booking-calendar-legend">
            <span className="booking-calendar-legend-item">
              <span className="legend-dot legend-dot--checkin" /> Check-in
            </span>
            <span className="booking-calendar-legend-item">
              <span className="legend-dot legend-dot--checkout" /> Check-out
            </span>
          </div>
        </div>

        <div className="booking-calendar-nav">
          <button className="nav-btn" onClick={prevMonth}>&larr; Prev</button>
          <div className="booking-calendar-nav-month">
            <span>{monthName}</span>
            <button className="nav-btn nav-btn--small" onClick={goToday}>Today</button>
          </div>
          <button className="nav-btn" onClick={nextMonth}>Next &rarr;</button>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <>
            <div className="calendar-grid">
              {dayNames.map(d => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}

              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-cell calendar-cell--empty" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateKey = formatDateKey(year, month, day)
                const dayData = dateMap.get(dateKey)
                const isSelected = selectedDay === dateKey
                const isToday = dateKey === todayKey

                const cellClasses = [
                  'calendar-cell',
                  dayData ? 'calendar-cell--clickable' : '',
                  isSelected ? 'calendar-cell--selected' : '',
                  isToday ? 'calendar-cell--today' : '',
                ].filter(Boolean).join(' ')

                return (
                  <div
                    key={day}
                    className={cellClasses}
                    onClick={() => dayData && setSelectedDay(isSelected ? null : dateKey)}
                  >
                    <div className={`calendar-day-number ${isToday ? 'calendar-day-number--today' : ''}`}>
                      {day}
                    </div>
                    {dayData && (
                      <div className="calendar-badges">
                        {(() => {
                          const pending = dayData.checkins.filter(b => !b.checkedIn).length
                          return pending > 0 ? (
                            <div className="badge badge--checkin">
                              {pending} check-in{pending > 1 ? 's' : ''}
                            </div>
                          ) : dayData.checkins.length > 0 ? (
                            <div className="badge badge--checkin badge--all-done">
                              ✓ {dayData.checkins.length} in
                            </div>
                          ) : null
                        })()}
                        {(() => {
                          const pending = dayData.checkouts.filter(b => !b.checkedOut).length
                          return pending > 0 ? (
                            <div className="badge badge--checkout">
                              {pending} check-out{pending > 1 ? 's' : ''}
                            </div>
                          ) : dayData.checkouts.length > 0 ? (
                            <div className="badge badge--checkout badge--all-done">
                              ✓ {dayData.checkouts.length} out
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {selectedDay && selectedBookings && (
              <div className="detail-panel">
                <h3>
                  {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </h3>

                {selectedBookings.checkins.length > 0 && (
                  <>
                    <div className="detail-section-title detail-section-title--checkin">Check-ins</div>
                    {selectedBookings.checkins.map(b => (
                      <BookingRow key={b._id} booking={b} type="checkin" onToggle={toggleStatus} />
                    ))}
                  </>
                )}

                {selectedBookings.checkouts.length > 0 && (
                  <>
                    <div className="detail-section-title detail-section-title--checkout">Check-outs</div>
                    {selectedBookings.checkouts.map(b => (
                      <BookingRow key={b._id} booking={b} type="checkout" onToggle={toggleStatus} />
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

function BookingRow({ booking, type, onToggle }: {
  booking: Booking
  type: 'checkin' | 'checkout'
  onToggle: (id: string, field: 'checkedIn' | 'checkedOut', current: boolean) => void
}) {
  const field = type === 'checkin' ? 'checkedIn' : 'checkedOut'
  const isDone = booking[field]
  const checkboxClass = `booking-checkbox${type === 'checkout' ? ' booking-checkbox--checkout' : ''}`

  return (
    <div className={`booking-row${isDone ? ' booking-row--done' : ''}`}>
      <input
        type="checkbox"
        className={checkboxClass}
        checked={isDone}
        onChange={() => onToggle(booking._id, field, isDone)}
        title={isDone ? `Undo ${type}` : `Mark as ${type === 'checkin' ? 'checked in' : 'checked out'}`}
      />
      <strong>{booking.roomName}</strong> &mdash; {booking.userName} {booking.userEmail && <span className="booking-row-email">&lt;{booking.userEmail}&gt;</span>}
      <span className="booking-row-meta">
        ({booking.adults} adult{booking.adults !== 1 ? 's' : ''}
        {booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}
        , qty: {booking.quantity})
      </span>
    </div>
  )
}

const bookingCalendarTool: Tool = {
  name: 'booking-calendar',
  title: 'Booking Calendar',
  icon: CalendarIcon,
  component: BookingCalendarComponent,
}

export const bookingCalendarPlugin = definePlugin({
  name: 'booking-calendar',
  tools: [bookingCalendarTool],
})
