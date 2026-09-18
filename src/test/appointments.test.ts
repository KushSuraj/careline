import { describe, expect, it } from 'vitest'
import { createInitialState, PATIENT_ID } from '../data/mock-data'
import { validateAppointment, sortAppointments } from '../lib/appointments'
import { dayFromToday } from '../lib/dates'
import type { BookingInput } from '../lib/schemas'

const validBooking = (): BookingInput => ({
  doctorId: 'sarah-johnson',
  date: dayFromToday(2),
  time: '09:30',
  type: 'In-person',
  reason: 'A routine health checkup',
})

describe('appointment validation', () => {
  it('accepts an available future slot', () => {
    expect(validateAppointment(validBooking(), createInitialState())).toBeNull()
  })
  it('rejects a date in the past', () => {
    expect(
      validateAppointment({ ...validBooking(), date: dayFromToday(-1) }, createInitialState()),
    ).toContain('future')
  })
  it('rejects dates beyond the scheduling window', () => {
    expect(
      validateAppointment({ ...validBooking(), date: dayFromToday(91) }, createInitialState()),
    ).toContain('90 days')
  })
  it('rejects invalid dates', () => {
    expect(
      validateAppointment({ ...validBooking(), date: '2026-02-31' }, createInitialState()),
    ).not.toBeNull()
  })
  it('rejects arbitrary times', () => {
    expect(
      validateAppointment({ ...validBooking(), time: '04:17' }, createInitialState()),
    ).toContain('available appointment time')
  })
  it('rejects a missing reason', () => {
    expect(validateAppointment({ ...validBooking(), reason: '' }, createInitialState())).toContain(
      'reason',
    )
  })
  it('prevents two patients booking the same doctor and slot', () => {
    const state = createInitialState()
    const input = validBooking()
    state.appointments.push({
      ...input,
      id: 'occupied',
      status: 'Confirmed',
      patientId: 'other-patient',
      patientName: 'Another patient',
    })
    expect(validateAppointment(input, state)).toContain('already booked')
  })
  it('prevents the same patient booking different doctors at the same time', () => {
    const state = createInitialState()
    const input = validBooking()
    state.appointments.push({
      ...input,
      doctorId: 'emily-chen',
      id: 'occupied',
      status: 'Confirmed',
      patientId: PATIENT_ID,
      patientName: 'Maya Patel',
    })
    expect(validateAppointment(input, state)).toContain('already have an appointment')
  })
  it('releases the time slot after cancellation', () => {
    const state = createInitialState()
    const input = validBooking()
    state.appointments.push({
      ...input,
      id: 'cancelled',
      status: 'Cancelled',
      patientId: PATIENT_ID,
      patientName: 'Maya Patel',
    })
    expect(validateAppointment(input, state)).toBeNull()
  })
  it('excludes the original appointment when rescheduling', () => {
    const state = createInitialState()
    const existing = state.appointments[0]
    expect(validateAppointment(existing, state, existing.id)).toBeNull()
  })
  it('blocks unavailable and unverified doctors', () => {
    const state = createInitialState()
    expect(validateAppointment({ ...validBooking(), doctorId: 'alex-thompson' }, state)).toContain(
      'not currently available',
    )
    expect(validateAppointment({ ...validBooking(), doctorId: 'priya-sharma' }, state)).toContain(
      'not currently available',
    )
  })
  it('sorts chronologically without modifying the source', () => {
    const state = createInitialState()
    const before = [...state.appointments]
    const sorted = sortAppointments(state.appointments)
    expect(sorted[0].date <= sorted[1].date).toBe(true)
    expect(state.appointments).toEqual(before)
  })
})
