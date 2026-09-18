import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { AppContext, type AppContextValue } from './app-context'
import { readDemoState, saveDemoState } from '../lib/storage'
import { createInitialState, DOCTOR_ID, PATIENT_ID } from '../data/mock-data'
import { localDate } from '../lib/dates'
import { validateAppointment } from '../lib/appointments'
import type { Appointment, DemoState, Notice } from '../types'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readDemoState)
  const stateRef = useRef(state)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [message, setMessage] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // The ref makes back-to-back bookings validate against the latest state.
  const update = useCallback((transform: (previous: DemoState) => DemoState) => {
    const next = transform(stateRef.current)
    stateRef.current = next
    setState(next)
    setStorageAvailable(saveDemoState(next))
  }, [])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const toast = useCallback((text: string) => {
    clearTimeout(timeoutRef.current)
    setMessage(text)
    timeoutRef.current = setTimeout(() => setMessage(''), 5000)
  }, [])

  const value: AppContextValue = {
    state,
    storageAvailable,
    toast,
    switchRole: (role) => update((previous) => ({ ...previous, role })),
    signIn: (role) => update((previous) => ({ ...previous, role, signedIn: true })),
    signOut: () => update((previous) => ({ ...previous, signedIn: false })),
    toggleFavorite: (id) =>
      update((previous) => ({
        ...previous,
        favorites: previous.favorites.includes(id)
          ? previous.favorites.filter((item) => item !== id)
          : [...previous.favorites, id],
      })),
    saveProfile: (profile) => {
      update((previous) => ({
        ...previous,
        profile,
        appointments: previous.appointments.map((item) =>
          item.patientId === PATIENT_ID ? { ...item, patientName: profile.name } : item,
        ),
      }))
      toast('Your profile has been updated.')
    },
    saveDoctor: (doctor) => {
      if (
        stateRef.current.role === 'patient' ||
        (stateRef.current.role === 'doctor' && doctor.id !== DOCTOR_ID)
      )
        return
      update((previous) => ({
        ...previous,
        doctors: previous.doctors.some((item) => item.id === doctor.id)
          ? previous.doctors.map((item) => (item.id === doctor.id ? doctor : item))
          : [...previous.doctors, doctor],
      }))
      toast('Doctor profile updated.')
    },
    bookAppointment: (input, rescheduleId) => {
      const current = stateRef.current
      if (!current.signedIn || current.role !== 'patient')
        return { error: 'Switch to the patient demo to book an appointment.' }
      const previous = rescheduleId
        ? current.appointments.find((item) => item.id === rescheduleId)
        : undefined
      if (
        rescheduleId &&
        (!previous || previous.patientId !== PATIENT_ID || previous.status !== 'Confirmed')
      )
        return { error: 'This appointment cannot be rescheduled.' }
      const error = validateAppointment(input, current, rescheduleId)
      if (error) return { error }
      const appointment: Appointment = {
        ...input,
        reason: input.reason.trim(),
        id: rescheduleId ?? `CL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        patientId: PATIENT_ID,
        patientName: current.profile.name,
        status: 'Confirmed',
      }
      const notice: Notice = {
        id: crypto.randomUUID(),
        title: rescheduleId ? 'Appointment rescheduled' : 'Appointment confirmed',
        message: `Your visit with ${current.doctors.find((item) => item.id === input.doctorId)?.name} is confirmed. View details in My appointments.`,
        read: false,
        role: 'patient',
        date: localDate(),
      }
      update((value) => ({
        ...value,
        appointments: rescheduleId
          ? value.appointments.map((item) => (item.id === rescheduleId ? appointment : item))
          : [...value.appointments, appointment],
        notifications: [notice, ...value.notifications],
      }))
      return { appointment }
    },
    setAppointmentStatus: (id, status) => {
      const current = stateRef.current
      const appointment = current.appointments.find((item) => item.id === id)
      if (!appointment || appointment.status !== 'Confirmed') return
      if (
        current.role === 'patient' &&
        (appointment.patientId !== PATIENT_ID || status === 'Completed')
      )
        return
      if (current.role === 'doctor' && appointment.doctorId !== DOCTOR_ID) return
      update((previous) => ({
        ...previous,
        appointments: previous.appointments.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
        notifications: [
          {
            id: crypto.randomUUID(),
            title: `Appointment ${status.toLowerCase()}`,
            message: `The status of appointment ${id} has been updated.`,
            read: false,
            role: current.role,
            date: localDate(),
          },
          ...previous.notifications,
        ],
      }))
      toast(`Appointment ${status.toLowerCase()}.`)
    },
    markNotificationsRead: () =>
      update((previous) => ({
        ...previous,
        notifications: previous.notifications.map((item) =>
          item.role === previous.role ? { ...item, read: true } : item,
        ),
      })),
    setPreference: (key, value) => {
      update((previous) => ({
        ...previous,
        preferences: { ...previous.preferences, [key]: value },
      }))
      toast('Preference saved for this demo.')
    },
    resetDemo: () => {
      update(() => createInitialState())
      toast('Demo data has been reset.')
    },
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {message && (
        <div
          className="fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-xl"
          role="status"
        >
          <CheckCircle2 size={19} />
          <span>{message}</span>
          <button
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Dismiss notification"
            onClick={() => setMessage('')}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </AppContext.Provider>
  )
}
