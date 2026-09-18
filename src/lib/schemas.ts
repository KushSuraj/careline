import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(80),
  email: z.email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{7,22}$/, 'Enter a valid phone number.'),
  birthDate: z.iso
    .date()
    .refine((value) => new Date(`${value}T00:00:00`) < new Date(), 'Enter a date in the past.'),
  gender: z.string().min(1, 'Select a gender.'),
  bloodGroup: z.string(),
  address: z.string().trim().max(200),
})

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

export const registerSchema = loginSchema
  .extend({
    name: z.string().trim().min(2, 'Enter your full name.').max(80),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d\s()-]{7,22}$/, 'Enter a valid phone number.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

export const bookingSchema = z.object({
  doctorId: z.string().min(1, 'Choose a doctor.'),
  date: z.iso.date('Choose an appointment date.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Choose a time slot.'),
  type: z.enum(['In-person', 'Video call']),
  reason: z
    .string()
    .trim()
    .min(5, 'Add a short reason for your visit (at least 5 characters).')
    .max(500, 'Keep the note under 500 characters.'),
})

export type BookingInput = z.infer<typeof bookingSchema>

const doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  qualification: z.string(),
  experience: z.number(),
  rating: z.number(),
  reviews: z.number(),
  fee: z.number(),
  image: z.string(),
  color: z.string(),
  location: z.string(),
  languages: z.array(z.string()),
  bio: z.string(),
  accepting: z.boolean(),
  verified: z.boolean(),
})

export const persistedStateSchema = z.object({
  version: z.literal(1),
  role: z.enum(['patient', 'doctor', 'admin']),
  signedIn: z.boolean(),
  profile: profileSchema,
  doctors: z.array(doctorSchema).min(1),
  favorites: z.array(z.string()),
  appointments: z.array(
    z.object({
      id: z.string(),
      doctorId: z.string(),
      patientId: z.string(),
      patientName: z.string(),
      date: z.iso.date(),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      type: z.enum(['In-person', 'Video call']),
      status: z.enum(['Confirmed', 'Completed', 'Cancelled']),
      reason: z.string(),
    }),
  ),
  notifications: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      message: z.string(),
      read: z.boolean(),
      role: z.enum(['patient', 'doctor', 'admin']),
      date: z.string(),
    }),
  ),
  preferences: z.object({
    emailReminders: z.boolean(),
    appointmentUpdates: z.boolean(),
    wellnessTips: z.boolean(),
  }),
})
