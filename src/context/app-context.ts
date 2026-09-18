import { createContext, useContext } from 'react'
import type { Appointment, DemoState, Doctor, Profile, Role } from '../types'
import type { BookingInput } from '../lib/schemas'

export interface AppContextValue {
  state: DemoState
  storageAvailable: boolean
  switchRole: (role: Role) => void
  signIn: (role: Role) => void
  signOut: () => void
  toggleFavorite: (id: string) => void
  saveProfile: (profile: Profile) => void
  saveDoctor: (doctor: Doctor) => void
  bookAppointment: (
    input: BookingInput,
    rescheduleId?: string,
  ) => { error?: string; appointment?: Appointment }
  setAppointmentStatus: (id: string, status: 'Cancelled' | 'Completed') => void
  markNotificationsRead: () => void
  setPreference: (key: keyof DemoState['preferences'], value: boolean) => void
  resetDemo: () => void
  toast: (message: string) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
