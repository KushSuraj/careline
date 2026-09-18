import type { Appointment, DemoState } from '../types'
import type { BookingInput } from './schemas'
import { bookingSchema } from './schemas'
import { dayFromToday, isFutureSlot } from './dates'
import { PATIENT_ID, TIME_SLOTS } from '../data/mock-data'

export function validateAppointment(
  input: BookingInput,
  state: Pick<DemoState, 'appointments' | 'doctors'>,
  excludeId?: string,
): string | null {
  const result = bookingSchema.safeParse(input)
  if (!result.success) return result.error.issues[0].message
  const doctor = state.doctors.find((item) => item.id === input.doctorId)
  if (!doctor?.accepting || !doctor.verified)
    return 'This doctor is not currently available for bookings.'
  if (!TIME_SLOTS.includes(input.time)) return 'Please select an available appointment time.'
  if (!isFutureSlot(input.date, input.time)) return 'Please choose a date and time in the future.'
  if (input.date > dayFromToday(90)) return 'Appointments can be booked up to 90 days ahead.'
  const conflict = state.appointments.find(
    (item) =>
      item.id !== excludeId &&
      item.status === 'Confirmed' &&
      item.date === input.date &&
      item.time === input.time &&
      (item.doctorId === input.doctorId || item.patientId === PATIENT_ID),
  )
  if (conflict)
    return conflict.doctorId === input.doctorId
      ? 'That time is already booked. Please choose another slot.'
      : 'You already have an appointment at this time.'
  return null
}

export function sortAppointments(items: Appointment[]): Appointment[] {
  return [...items].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
}
