import {
  createSlice,
  type PayloadAction,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit'
import { validateAppointment } from '../lib/appointments'
import { localDate } from '../lib/dates'
import { createInitialState, DOCTOR_ID, PATIENT_ID } from '../data/mock-data'
import type { BookingInput } from '../lib/schemas'
import type { Appointment, DemoState, Doctor, Notice, Profile, Role } from '../types'

export interface AppSliceState {
  data: DemoState
  storageAvailable: boolean
  toast: { id: number; message: string }
}

interface AppRootState {
  app: AppSliceState
}

type AppThunk<Return = void> = ThunkAction<Return, AppRootState, unknown, UnknownAction>
type AppointmentResult = { error?: string; appointment?: Appointment }

export function createAppState(data: DemoState): AppSliceState {
  return { data, storageAvailable: true, toast: { id: 0, message: '' } }
}

const initialState = createAppState(createInitialState())

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    switchRole(state, action: PayloadAction<Role>) {
      state.data.role = action.payload
    },
    signIn(state, action: PayloadAction<Role>) {
      state.data.role = action.payload
      state.data.signedIn = true
    },
    signedOut(state) {
      state.data.signedIn = false
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload
      state.data.favorites = state.data.favorites.includes(id)
        ? state.data.favorites.filter((item) => item !== id)
        : [...state.data.favorites, id]
    },
    profileSaved(state, action: PayloadAction<Profile>) {
      state.data.profile = action.payload
      state.data.appointments.forEach((appointment) => {
        if (appointment.patientId === PATIENT_ID) appointment.patientName = action.payload.name
      })
    },
    doctorSaved(state, action: PayloadAction<Doctor>) {
      const index = state.data.doctors.findIndex((doctor) => doctor.id === action.payload.id)
      if (index === -1) state.data.doctors.push(action.payload)
      else state.data.doctors[index] = action.payload
    },
    appointmentBooked(state, action: PayloadAction<Appointment>) {
      const index = state.data.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id,
      )
      if (index === -1) state.data.appointments.push(action.payload)
      else state.data.appointments[index] = action.payload
    },
    notificationAdded(state, action: PayloadAction<Notice>) {
      state.data.notifications.unshift(action.payload)
    },
    appointmentStatusChanged(
      state,
      action: PayloadAction<{ id: string; status: 'Cancelled' | 'Completed' }>,
    ) {
      const appointment = state.data.appointments.find((item) => item.id === action.payload.id)
      if (appointment) appointment.status = action.payload.status
    },
    markNotificationsRead(state) {
      state.data.notifications.forEach((notification) => {
        if (notification.role === state.data.role) notification.read = true
      })
    },
    preferenceChanged(
      state,
      action: PayloadAction<{
        key: keyof DemoState['preferences']
        value: boolean
      }>,
    ) {
      state.data.preferences[action.payload.key] = action.payload.value
    },
    demoReset(state) {
      state.data = createInitialState()
    },
    storageAvailabilityChanged(state, action: PayloadAction<boolean>) {
      state.storageAvailable = action.payload
    },
    showToast(state, action: PayloadAction<string>) {
      state.toast.id += 1
      state.toast.message = action.payload
    },
    dismissToast(state, action: PayloadAction<number | undefined>) {
      if (action.payload === undefined || action.payload === state.toast.id) {
        state.toast.message = ''
      }
    },
  },
})

export const {
  dismissToast,
  markNotificationsRead,
  showToast,
  signIn,
  storageAvailabilityChanged,
  switchRole,
  toggleFavorite,
} = appSlice.actions

const {
  appointmentBooked,
  appointmentStatusChanged,
  demoReset,
  doctorSaved,
  notificationAdded,
  preferenceChanged,
  profileSaved,
  signedOut,
} = appSlice.actions

export const selectAppState = (state: AppRootState) => state.app.data
export const selectStorageAvailable = (state: AppRootState) => state.app.storageAvailable
export const selectToast = (state: AppRootState) => state.app.toast

export const signOut = (): AppThunk => (dispatch) => {
  localStorage.removeItem('token')
  dispatch(signedOut())
}

export const saveProfile =
  (profile: Profile): AppThunk =>
  (dispatch) => {
    dispatch(profileSaved(profile))
    dispatch(showToast('Your profile has been updated.'))
  }

export const saveDoctor =
  (doctor: Doctor): AppThunk =>
  (dispatch, getState) => {
    const { role } = getState().app.data
    if (role === 'patient' || (role === 'doctor' && doctor.id !== DOCTOR_ID)) return
    dispatch(doctorSaved(doctor))
    dispatch(showToast('Doctor profile updated.'))
  }

export const bookAppointment =
  (input: BookingInput, rescheduleId?: string): AppThunk<AppointmentResult> =>
  (dispatch, getState) => {
    const current = getState().app.data
    if (!current.signedIn || current.role !== 'patient') {
      return { error: 'Switch to the patient demo to book an appointment.' }
    }

    const previous = rescheduleId
      ? current.appointments.find((appointment) => appointment.id === rescheduleId)
      : undefined
    if (
      rescheduleId &&
      (!previous || previous.patientId !== PATIENT_ID || previous.status !== 'Confirmed')
    ) {
      return { error: 'This appointment cannot be rescheduled.' }
    }

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
      message: `Your visit with ${current.doctors.find((doctor) => doctor.id === input.doctorId)?.name} is confirmed. View details in My appointments.`,
      read: false,
      role: 'patient',
      date: localDate(),
    }
    dispatch(appointmentBooked(appointment))
    dispatch(notificationAdded(notice))
    return { appointment }
  }

export const setAppointmentStatus =
  (id: string, status: 'Cancelled' | 'Completed'): AppThunk =>
  (dispatch, getState) => {
    const current = getState().app.data
    const appointment = current.appointments.find((item) => item.id === id)
    if (!appointment || appointment.status !== 'Confirmed') return
    if (
      current.role === 'patient' &&
      (appointment.patientId !== PATIENT_ID || status === 'Completed')
    ) {
      return
    }
    if (current.role === 'doctor' && appointment.doctorId !== DOCTOR_ID) return

    dispatch(appointmentStatusChanged({ id, status }))
    dispatch(
      notificationAdded({
        id: crypto.randomUUID(),
        title: `Appointment ${status.toLowerCase()}`,
        message: `The status of appointment ${id} has been updated.`,
        read: false,
        role: current.role,
        date: localDate(),
      }),
    )
    dispatch(showToast(`Appointment ${status.toLowerCase()}.`))
  }

export const setPreference =
  (key: keyof DemoState['preferences'], value: boolean): AppThunk =>
  (dispatch) => {
    dispatch(preferenceChanged({ key, value }))
    dispatch(showToast('Preference saved for this demo.'))
  }

export const resetDemo = (): AppThunk => (dispatch) => {
  dispatch(demoReset())
  dispatch(showToast('Demo data has been reset.'))
}

export default appSlice.reducer
