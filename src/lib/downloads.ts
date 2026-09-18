import type { Appointment, Doctor } from '../types'

export function downloadText(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadCalendar(appointment: Appointment, doctor: Doctor) {
  const start = new Date(`${appointment.date}T${appointment.time}:00`)
  const end = new Date(start.getTime() + 30 * 60_000)
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')
  const escape = (text: string) =>
    text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
  downloadText(
    `${appointment.id}.ics`,
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Careline//UI Demo//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@careline.demo`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(`DEMO: Appointment with ${doctor.name}`)}`,
      `LOCATION:${escape(appointment.type === 'Video call' ? 'Demo video consultation' : doctor.location)}`,
      'DESCRIPTION:Fictional Careline UI appointment. No real visit is booked.',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n'),
    'text/calendar;charset=utf-8',
  )
}

export function csvCell(value: string): string {
  const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}
