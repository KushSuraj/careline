export type Role = 'patient' | 'doctor' | 'admin'
export type VisitType = 'In-person' | 'Video call'
export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled'

export interface Doctor {
  id: string
  name: string
  specialty: string
  qualification: string
  experience: number
  rating: number
  reviews: number
  fee: number
  image: string
  color: string
  location: string
  languages: string[]
  bio: string
  accepting: boolean
  verified: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  date: string
  time: string
  type: VisitType
  status: AppointmentStatus
  reason: string
}

export interface Notice {
  id: string
  title: string
  message: string
  read: boolean
  role: Role
  date: string
}

export interface Profile {
  name: string
  email: string
  phone: string
  birthDate: string
  gender: string
  bloodGroup: string
  address: string
}

export interface DemoState {
  version: 1
  role: Role
  signedIn: boolean
  profile: Profile
  doctors: Doctor[]
  appointments: Appointment[]
  favorites: string[]
  notifications: Notice[]
  preferences: { emailReminders: boolean; appointmentUpdates: boolean; wellnessTips: boolean }
}
