import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Check, LogOut, RotateCcw, ShieldCheck, UserRound } from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link, useNavigate } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Badge, Button, Modal, PageHeading } from '../components/ui'
import { profileSchema } from '../lib/schemas'
import { localDate } from '../lib/dates'
import { DOCTOR_ID } from '../data/mock-data'
import type { Profile } from '../types'

export default function Settings() {
  const { state, saveProfile, setPreference, signOut, resetDemo } = useApp()
  const [tab, setTab] = useState('profile')
  const [resetOpen, setResetOpen] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Profile>({ resolver: zodResolver(profileSchema), defaultValues: state.profile })
  const doctor = state.doctors.find((item) => item.id === DOCTOR_ID)
  const name =
    state.role === 'patient'
      ? state.profile.name
      : state.role === 'doctor'
        ? (doctor?.name ?? '')
        : 'Alex Morgan'
  return (
    <div className={ui.page}>
      <PageHeading
        title="Make yourself at home."
        description="Your profile, preferences, and demo account controls."
      />
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav className={cn(ui.panel, 'h-fit p-2')} aria-label="Settings sections">
          {[
            { id: 'profile', label: 'Personal information', icon: UserRound },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'demo', label: 'Demo & account', icon: ShieldCheck },
          ].map(({ id, label, icon: Icon }) => (
            <button
              className={cn(
                'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-slate-600',
                tab === id && 'bg-teal-50 text-teal-700',
              )}
              onClick={() => setTab(id)}
              key={id}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className={cn(ui.panel, 'p-5 md:p-6')}>
          {tab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                <Avatar
                  name={name}
                  src={state.role === 'doctor' ? doctor?.image : undefined}
                  size="lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{name}</h2>
                  <p className="text-sm text-slate-500">
                    {state.role === 'patient'
                      ? state.profile.email
                      : `${state.role}@careline.example`}
                  </p>
                </div>
                <Badge>{state.role} account</Badge>
              </div>
              {state.role === 'patient' ? (
                <form
                  onSubmit={handleSubmit((values) => {
                    saveProfile(values)
                    reset(values)
                  })}
                  noValidate
                >
                  <h3 className={ui.subheading}>Personal information</h3>
                  <p className="mb-6 mt-1 text-sm text-slate-500">
                    Use fictional information while exploring this UI.
                  </p>
                  <div className={ui.formGrid}>
                    <label className={ui.label}>
                      <span>Full name</span>
                      <input
                        className={ui.input}
                        {...register('name')}
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <small className={ui.error} role="alert">
                          {errors.name.message}
                        </small>
                      )}
                    </label>
                    <label className={ui.label}>
                      <span>Email address</span>
                      <input
                        className={ui.input}
                        {...register('email')}
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <small className={ui.error} role="alert">
                          {errors.email.message}
                        </small>
                      )}
                    </label>
                    <label className={ui.label}>
                      <span>Phone number</span>
                      <input
                        className={ui.input}
                        {...register('phone')}
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <small className={ui.error} role="alert">
                          {errors.phone.message}
                        </small>
                      )}
                    </label>
                    <label className={ui.label}>
                      <span>Date of birth</span>
                      <input
                        className={ui.input}
                        {...register('birthDate')}
                        type="date"
                        max={localDate()}
                        aria-invalid={!!errors.birthDate}
                      />
                      {errors.birthDate && (
                        <small className={ui.error} role="alert">
                          {errors.birthDate.message}
                        </small>
                      )}
                    </label>
                    <label className={ui.label}>
                      <span>Gender</span>
                      <select className={ui.select} {...register('gender')}>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </label>
                    <label className={ui.label}>
                      <span>Blood group</span>
                      <select className={ui.select} {...register('bloodGroup')}>
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map(
                          (group) => (
                            <option key={group}>{group}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label className={cn(ui.label, 'md:col-span-2')}>
                      <span>Location</span>
                      <input
                        className={ui.input}
                        {...register('address')}
                        autoComplete="address-level2"
                      />
                      {errors.address && (
                        <small className={ui.error}>{errors.address.message}</small>
                      )}
                    </label>
                  </div>
                  <div className={ui.formActions}>
                    <span className="text-sm text-slate-500">
                      Changes are saved on this device.
                    </span>
                    <Button type="submit" disabled={!isDirty}>
                      <Check size={16} />
                      Save changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid place-items-center gap-4 rounded-xl bg-slate-50 p-8 text-center">
                  <ShieldCheck size={30} className="text-teal-700" />
                  <h3 className={ui.subheading}>
                    {state.role === 'doctor'
                      ? 'Your professional profile'
                      : 'Administrator demo account'}
                  </h3>
                  <p className="max-w-lg text-sm leading-6 text-slate-500">
                    {state.role === 'doctor'
                      ? 'Update your specialty, consultation fee, availability, and introduction from your doctor profile.'
                      : 'This sample administrator account can manage doctors, review patients, and track appointments.'}
                  </p>
                  <Link
                    to={state.role === 'doctor' ? '/doctor-profile' : '/manage-doctors'}
                    className="inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
                  >
                    {state.role === 'doctor' ? 'Edit doctor profile' : 'Manage doctors'}
                  </Link>
                </div>
              )}
            </div>
          )}
          {tab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h2 className={ui.subheading}>A little less noise. A little more care.</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the updates that matter to you.
                </p>
              </div>
              {[
                {
                  key: 'appointmentUpdates',
                  title: 'Appointment updates',
                  text: 'Booking confirmations, rescheduling, and cancellations.',
                },
                {
                  key: 'emailReminders',
                  title: 'Email reminders',
                  text: 'A friendly reminder before your next visit.',
                },
                {
                  key: 'wellnessTips',
                  title: 'Wellness inspiration',
                  text: 'Occasional ideas for everyday wellbeing.',
                },
              ].map((item) => {
                const checked = state.preferences[item.key as keyof typeof state.preferences]
                return (
                  <div
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                    key={item.key}
                  >
                    <div>
                      <strong className="text-sm text-slate-900">{item.title}</strong>
                      <p className="mt-1 text-sm text-slate-500">{item.text}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={item.title}
                      className={cn(
                        'relative h-7 w-12 rounded-full transition',
                        checked ? 'bg-teal-700' : 'bg-slate-200',
                      )}
                      onClick={() =>
                        setPreference(item.key as keyof typeof state.preferences, !checked)
                      }
                    >
                      <span
                        className={cn(
                          'absolute top-1 h-5 w-5 rounded-full bg-white transition',
                          checked ? 'left-6' : 'left-1',
                        )}
                      />
                    </button>
                  </div>
                )
              })}
              <div className="flex gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
                <Bell size={18} />
                <span>
                  These preferences are saved for the demo. No emails or push notifications are
                  sent.
                </span>
              </div>
            </div>
          )}
          {tab === 'demo' && (
            <div className="space-y-4">
              <div>
                <h2 className={ui.subheading}>Your demo space</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Explore freely. Start fresh whenever you like.
                </p>
              </div>
              <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
                <ShieldCheck size={25} className="text-teal-700" />
                <div>
                  <strong className="text-sm text-slate-900">UI demonstration only</strong>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Role switching and sign-in are simulated in your browser. No backend, real
                    authentication, payments, or clinical services are connected.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <strong className="text-sm text-slate-900">Log out</strong>
                  <p className="mt-1 text-sm text-slate-500">Return to the demo sign-in screen.</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    signOut()
                    navigate('/login')
                  }}
                >
                  <LogOut size={16} />
                  Log out
                </Button>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <strong className="text-sm text-slate-900">Reset demo data</strong>
                  <p className="mt-1 text-sm text-slate-500">
                    Restore the original sample appointments, doctors, and preferences.
                  </p>
                </div>
                <Button variant="secondary" onClick={() => setResetOpen(true)}>
                  <RotateCcw size={16} />
                  Reset demo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {resetOpen && (
        <Modal title="Start fresh?" onClose={() => setResetOpen(false)}>
          <p className={ui.muted}>
            This will replace the changes you made on this device with the original dummy data.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Keep my changes
            </Button>
            <Button
              onClick={() => {
                resetDemo()
                setResetOpen(false)
                navigate('/')
              }}
            >
              Reset demo data
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
