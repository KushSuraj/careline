import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Video,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link, useParams, useSearchParams } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Badge, Button, EmptyState, PageHeading } from '../components/ui'
import { bookingSchema, type BookingInput } from '../lib/schemas'
import { dayFromToday, formatDate, formatTime, isFutureSlot, localDate } from '../lib/dates'
import { PATIENT_ID, TIME_SLOTS } from '../data/mock-data'
import type { Appointment } from '../types'

export default function Booking() {
  const { doctorId } = useParams()
  const [params] = useSearchParams()
  const { state, bookAppointment } = useApp()
  const doctor = state.doctors.find((item) => item.id === doctorId && item.verified)
  const rescheduleId = params.get('reschedule') ?? undefined
  const existing = state.appointments.find(
    (item) =>
      item.id === rescheduleId &&
      item.patientId === PATIENT_ID &&
      item.doctorId === doctorId &&
      item.status === 'Confirmed',
  )
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState<Appointment | null>(null)
  const {
    register,
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctorId: doctorId ?? '',
      date: existing?.date ?? dayFromToday(1),
      time: existing?.time ?? '',
      type: existing?.type ?? 'In-person',
      reason: existing?.reason ?? '',
    },
  })
  const values = useWatch({ control })
  if (!doctor || !doctor.accepting || (rescheduleId && !existing && !confirmed))
    return (
      <EmptyState
        title="This booking is unavailable"
        description="Choose another doctor or review your current appointments."
      >
        <Link
          to="/doctors"
          className="inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
        >
          Find a doctor
        </Link>
      </EmptyState>
    )

  const submit = (input: BookingInput) => {
    if (!agreed) {
      setStep(2)
      return
    }
    const result = bookAppointment(input, rescheduleId)
    if (result.error) {
      setError(result.error)
      setStep(1)
      return
    }
    setConfirmed(result.appointment!)
  }

  if (confirmed)
    return (
      <div className="mx-auto grid max-w-2xl place-items-center gap-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
          <CheckCircle2 size={39} />
        </div>
        <Badge>YOU'RE ALL SET</Badge>
        <h1 className="text-3xl font-semibold text-slate-900">
          {rescheduleId ? 'A new time, the same great care.' : 'Your next step to better health.'}
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          Your demo appointment is {rescheduleId ? 'rescheduled' : 'confirmed'}. We saved the
          details for you.
        </p>
        <div className={cn(ui.panel, 'w-full space-y-4 p-6')}>
          <Avatar name={doctor.name} src={doctor.image} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{doctor.name}</h2>
            <p className="text-sm text-slate-500">{doctor.specialty}</p>
          </div>
          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={17} />
              {formatDate(confirmed.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 size={17} />
              {formatTime(confirmed.time)} · 30 minutes
            </span>
            <span className="inline-flex items-center gap-2">
              {confirmed.type === 'Video call' ? <Video size={17} /> : <MapPin size={17} />}
              {confirmed.type === 'Video call' ? 'Video consultation' : doctor.location}
            </span>
          </div>
          <small className="text-xs text-slate-400">Booking reference: {confirmed.id}</small>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={`/appointments?detail=${confirmed.id}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
          >
            View my appointment
            <ArrowRight size={17} />
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            Back to overview
          </Link>
        </div>
        <span className="text-sm text-slate-500">
          This is a demo confirmation. No real appointment has been booked.
        </span>
      </div>
    )

  return (
    <div className={ui.page}>
      <Link to={`/doctors/${doctor.id}`} className={ui.link}>
        <ArrowLeft size={16} />
        Back to doctor profile
      </Link>
      <PageHeading
        title={rescheduleId ? 'Let’s find a better time.' : 'A little time for your wellbeing.'}
        description={
          rescheduleId
            ? 'Choose a new time for your upcoming appointment.'
            : 'Your next appointment is just a few simple steps away.'
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <ol className="grid gap-2 sm:grid-cols-3" aria-label="Booking progress">
            {['Date & time', 'Visit details', 'Review & confirm'].map((label, index) => (
              <li
                className={cn(
                  'flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-500',
                  step === index + 1 && 'border-teal-200 bg-teal-50 text-teal-800',
                  step > index + 1 && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                )}
                key={label}
                aria-current={step === index + 1 ? 'step' : undefined}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs shadow-sm">
                  {step > index + 1 ? <Check size={15} /> : index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <form
            className={cn(ui.panel, 'space-y-5 p-5 md:p-6')}
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            {error && (
              <div
                className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}
            {step === 1 && (
              <>
                <div>
                  <h2 className={ui.subheading}>How would you like to meet?</h2>
                  <p className={ui.muted}>Choose the kind of care that works for you.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(['In-person', 'Video call'] as const).map((type) => (
                    <label
                      className={cn(
                        'flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 transition',
                        values.type === type &&
                          'border-teal-600 bg-teal-50 ring-2 ring-teal-600/10',
                      )}
                      key={type}
                    >
                      <input {...register('type')} type="radio" value={type} className="sr-only" />
                      {type === 'In-person' ? <MapPin size={22} /> : <Video size={22} />}
                      <span className="grid gap-1">
                        <strong className="text-sm text-slate-900">
                          {type === 'In-person' ? 'In-person visit' : 'Video consultation'}
                        </strong>
                        <small className="text-xs text-slate-500">
                          {type === 'In-person'
                            ? 'At the doctor’s clinic'
                            : 'From the comfort of home'}
                        </small>
                      </span>
                    </label>
                  ))}
                </div>
                <label className={ui.label}>
                  <span>Choose a date</span>
                  <input
                    className={ui.input}
                    type="date"
                    {...register('date', { onChange: () => setValue('time', '') })}
                    min={localDate()}
                    max={dayFromToday(90)}
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                  />
                  {errors.date && (
                    <small id="date-error" className={ui.error}>
                      {errors.date.message}
                    </small>
                  )}
                </label>
                <fieldset className="space-y-3">
                  <legend className="text-sm font-semibold text-slate-800">
                    Available times{' '}
                    <span className="font-normal text-slate-500">· 30-minute appointments</span>
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((time) => {
                      const unavailable =
                        !values.date ||
                        !isFutureSlot(values.date, time) ||
                        state.appointments.some(
                          (item) =>
                            item.id !== rescheduleId &&
                            item.status === 'Confirmed' &&
                            item.date === values.date &&
                            item.time === time &&
                            (item.doctorId === doctor.id || item.patientId === PATIENT_ID),
                        )
                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={unavailable}
                          className={cn(
                            'min-h-10 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 disabled:bg-slate-50 disabled:text-slate-300',
                            values.time === time &&
                              'border-teal-700 bg-teal-700 text-white hover:bg-teal-700',
                          )}
                          aria-pressed={values.time === time}
                          onClick={() => {
                            setValue('time', time, { shouldValidate: true })
                            setError('')
                          }}
                        >
                          {formatTime(time)}
                        </button>
                      )
                    })}
                  </div>
                  {errors.time && (
                    <small className={ui.error} role="alert">
                      {errors.time.message}
                    </small>
                  )}
                </fieldset>
                <div className={ui.formActions}>
                  <span className="text-sm text-slate-500">
                    Times are in your device’s local timezone.
                  </span>
                  <Button
                    type="button"
                    onClick={async () => {
                      if (await trigger(['date', 'time', 'type'])) setStep(2)
                    }}
                  >
                    Continue
                    <ArrowRight size={17} />
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <h2 className={ui.subheading}>Tell us a little about your visit.</h2>
                  <p className={ui.muted}>A short note helps your doctor prepare.</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <Avatar name={state.profile.name} />
                  <div className="flex-1">
                    <strong className="text-sm text-slate-900">{state.profile.name}</strong>
                    <p className="text-sm text-slate-500">{state.profile.email}</p>
                  </div>
                  <Badge>Patient</Badge>
                </div>
                <label className={ui.label}>
                  <span id="booking-reason-label">Reason for your visit</span>
                  <textarea
                    className={ui.textarea}
                    {...register('reason')}
                    aria-labelledby="booking-reason-label"
                    rows={5}
                    maxLength={500}
                    placeholder="For example, a routine checkup or a follow-up visit..."
                    aria-invalid={!!errors.reason}
                    aria-describedby="reason-help"
                  />
                  <small
                    id="reason-help"
                    className={errors.reason ? ui.error : 'text-xs text-slate-500'}
                  >
                    {errors.reason?.message ??
                      `${values.reason?.length ?? 0}/500 characters · Please use fictional information.`}
                  </small>
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                  />
                  <span>
                    I understand this is a UI demo and no real appointment will be booked.
                  </span>
                </label>
                <div className={ui.formActions}>
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={!agreed}
                    onClick={async () => {
                      if (await trigger('reason')) setStep(3)
                    }}
                  >
                    Review appointment
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <h2 className={ui.subheading}>One last look before you’re all set.</h2>
                  <p className={ui.muted}>Make sure these details look right.</p>
                </div>
                <dl className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                  {[
                    ['Patient', state.profile.name],
                    ['Doctor', doctor.name],
                    ['Date', values.date ? formatDate(values.date) : ''],
                    ['Time', values.time ? `${formatTime(values.time)} · 30 minutes` : ''],
                    ['Visit type', values.type ?? ''],
                    ['Reason for visit', values.reason ?? ''],
                    ['Consultation fee', `$${doctor.fee} (demo pricing)`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-white p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </dt>
                      <dd className="mt-1 text-slate-800">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
                  <ShieldCheck size={19} />
                  <span>No payment or personal medical information is required.</span>
                </div>
                <div className={ui.formActions}>
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Confirming...'
                      : rescheduleId
                        ? 'Confirm new time'
                        : 'Confirm appointment'}
                    <Check size={17} />
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
        <aside className="space-y-3">
          <div className={cn(ui.panel, 'space-y-4 p-5')}>
            <h3 className="text-lg font-semibold text-slate-900">Your appointment</h3>
            <div className="flex items-center gap-3">
              <Avatar name={doctor.name} src={doctor.image} size="lg" />
              <div>
                <strong className="text-sm text-slate-900">{doctor.name}</strong>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
              </div>
            </div>
            {[
              [CalendarDays, values.date ? formatDate(values.date) : 'Choose a date'],
              [Clock3, values.time ? `${formatTime(values.time)} · 30 min` : 'Choose a time'],
            ].map(([Icon, text]) => (
              <div key={String(text)} className="flex items-center gap-2 text-sm text-slate-600">
                <Icon size={17} />
                <span>{String(text)}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {values.type === 'Video call' ? <Video size={17} /> : <MapPin size={17} />}
              <span>{values.type === 'Video call' ? 'Video consultation' : doctor.location}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">Consultation fee</span>
              <strong className="text-slate-900">${doctor.fee}</strong>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-teal-700">
              <ShieldCheck size={16} />
              No payment needed
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Plans change. You can manage this visit anytime from My appointments.
          </p>
        </aside>
      </div>
    </div>
  )
}
