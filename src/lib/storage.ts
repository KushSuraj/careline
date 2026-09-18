import { createInitialState } from '../data/mock-data'
import { persistedStateSchema } from './schemas'
import type { DemoState } from '../types'

export const STORAGE_KEY = 'careline-ui:v1'

export function readDemoState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = persistedStateSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return createInitialState()
    const ids = new Set(parsed.data.doctors.map((doctor) => doctor.id))
    if (parsed.data.appointments.some((appointment) => !ids.has(appointment.doctorId)))
      return createInitialState()
    return parsed.data
  } catch {
    return createInitialState()
  }
}

export function saveDemoState(state: DemoState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
