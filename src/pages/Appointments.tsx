import { useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Plus,
  Search,
  Video,
  X,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link, useSearchParams } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Badge, Button, EmptyState, Modal, PageHeading } from '../components/ui'
import { DOCTOR_ID, PATIENT_ID } from '../data/mock-data'
import { formatDate, formatTime } from '../lib/dates'
import { sortAppointments } from '../lib/appointments'
import { downloadCalendar } from '../lib/downloads'
import type { AppointmentStatus } from '../types'

const tabs = [
  { label: 'Upcoming', status: 'Confirmed' },
  { label: 'Completed', status: 'Completed' },
  { label: 'Cancelled', status: 'Cancelled' },
  { label: 'All appointments', status: 'All' },
] as const

export default function Appointments() {
  const { state, setAppointmentStatus } = useApp()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState<AppointmentStatus | 'All'>('Confirmed')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const patient = state.role === 'patient'
  const scoped = state.appointments.filter((item) =>
    patient
      ? item.patientId === PATIENT_ID
      : state.role === 'doctor'
        ? item.doctorId === DOCTOR_ID
        : true,
  )
  const query = params.get('q') ?? ''
  const date = params.get('date') ?? ''
  const filtered = sortAppointments(
    scoped.filter(
      (item) =>
        (tab === 'All' || item.status === tab) &&
        (!date || item.date === date) &&
        `${item.patientName} ${state.doctors.find((doctor) => doctor.id === item.doctorId)?.name} ${item.reason} ${item.id}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ),
  )
  if (tab === 'Completed' || tab === 'Cancelled') filtered.reverse()
  const detail = scoped.find((item) => item.id === params.get('detail'))
  const detailDoctor = detail && state.doctors.find((item) => item.id === detail.doctorId)
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  return (
    <div className={ui.page}>
      <PageHeading
        title={patient ? 'Your care, on your calendar.' : 'Appointments'}
        description={
          patient
            ? 'Stay on top of your visits, all in one place.'
            : 'A clear view of every visit and every next step.'
        }
      >
        {patient && (
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
            to="/doctors"
          >
            <Plus size={17} />
            Book appointment
          </Link>
        )}
      </PageHeading>
      <section className={cn(ui.panel, 'overflow-hidden')}>
        <div
          className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3"
          role="tablist"
          aria-label="Appointment status"
        >
          {tabs.map((item) => (
            <button
              role="tab"
              aria-selected={tab === item.status}
              key={item.status}
              className={cn(
                'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600',
                tab === item.status && 'bg-teal-50 text-teal-700',
              )}
              onClick={() => setTab(item.status)}
            >
              {item.label}
              <span className="rounded bg-white px-1.5 py-0.5 text-xs">
                {
                  scoped.filter(
                    (appointment) => item.status === 'All' || appointment.status === item.status,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_auto]">
          <div className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={18} className="text-slate-400" />
            <input
              aria-label="Search appointments"
              placeholder="Search a doctor, patient, or appointment..."
              value={query}
              onChange={(event) => setParam('q', event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-500">
            <CalendarDays size={17} />
            <input
              aria-label="Filter appointments by date"
              type="date"
              value={date}
              onChange={(event) => setParam('date', event.target.value)}
              className="bg-transparent text-sm outline-none"
            />
            {date && (
              <button
                className={ui.iconButton}
                aria-label="Clear date filter"
                onClick={() => setParam('date', '')}
              >
                <X size={15} />
              </button>
            )}
          </label>
        </div>
        {filtered.length ? (
          <div className="grid gap-4 p-4">
            {filtered.map((appointment) => {
              const doctor = state.doctors.find((item) => item.id === appointment.doctorId)!
              return (
                <article className="rounded-xl border border-slate-200 p-4" key={appointment.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-3">
                      <Avatar
                        name={patient ? doctor.name : appointment.patientName}
                        src={patient ? doctor.image : undefined}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {patient ? doctor.name : appointment.patientName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {patient ? doctor.specialty : doctor.name} · {appointment.reason}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {formatDate(appointment.date, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={14} />
                            {formatTime(appointment.time)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            {appointment.type === 'Video call' ? (
                              <Video size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            {appointment.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      tone={
                        appointment.status === 'Confirmed'
                          ? 'green'
                          : appointment.status === 'Completed'
                            ? 'blue'
                            : 'gray'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-slate-500">Appointment #{appointment.id}</span>
                    <div className="flex flex-wrap gap-2">
                      {appointment.status === 'Confirmed' && patient && (
                        <Link
                          className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700"
                          to={`/book/${doctor.id}?reschedule=${appointment.id}`}
                        >
                          Reschedule
                        </Link>
                      )}
                      {appointment.status === 'Confirmed' && !patient && (
                        <Button
                          className="min-h-9 px-3"
                          variant="secondary"
                          onClick={() => setAppointmentStatus(appointment.id, 'Completed')}
                        >
                          <CheckCircle2 size={15} />
                          Mark completed
                        </Button>
                      )}
                      <Button
                        className="min-h-9 px-3"
                        variant="ghost"
                        onClick={() => setParam('detail', appointment.id)}
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              icon={CalendarDays}
              title="A clear calendar, a fresh start."
              description="No appointments match this view. Try another status or clear your search."
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setParams({})
                  setTab('All')
                }}
              >
                Show all appointments
              </Button>
            </EmptyState>
          </div>
        )}
        <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          Showing {filtered.length} of {scoped.length} appointments
        </div>
      </section>
      {detail && detailDoctor && (
        <Modal title="Appointment details" onClose={() => setParam('detail', '')}>
          <div className="flex items-center gap-3">
            <Avatar name={detailDoctor.name} src={detailDoctor.image} size="lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{detailDoctor.name}</h3>
              <p className="text-sm text-slate-500">{detailDoctor.specialty}</p>
            </div>
            <Badge tone={detail.status === 'Cancelled' ? 'gray' : 'green'}>{detail.status}</Badge>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Patient', detail.patientName],
              ['Date & time', `${formatDate(detail.date)} at ${formatTime(detail.time)}`],
              ['Visit type', detail.type],
              [
                'Location',
                detail.type === 'Video call' ? 'Demo video room' : detailDoctor.location,
              ],
              ['Reason', detail.reason],
              ['Reference', detail.id],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          {detail.status === 'Confirmed' && (
            <>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => downloadCalendar(detail, detailDoctor)}>
                  <Download size={16} />
                  Save to calendar
                </Button>
                {detail.type === 'Video call' && (
                  <Button
                    onClick={() => {
                      setParam('detail', '')
                      setVideoOpen(true)
                    }}
                  >
                    <Video size={17} />
                    Preview video room
                  </Button>
                )}
              </div>
              <button
                className="text-sm font-semibold text-red-600 hover:text-red-700"
                onClick={() => {
                  setCancelId(detail.id)
                  setParam('detail', '')
                }}
              >
                Cancel appointment
              </button>
            </>
          )}
        </Modal>
      )}
      {cancelId && (
        <Modal title="Cancel this appointment?" onClose={() => setCancelId(null)}>
          <p className={ui.muted}>
            This will free up the time slot in your demo. You can always book another visit when
            you’re ready.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setCancelId(null)}>
              Keep appointment
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setAppointmentStatus(cancelId, 'Cancelled')
                setCancelId(null)
              }}
            >
              Yes, cancel appointment
            </Button>
          </div>
        </Modal>
      )}
      {videoOpen && (
        <Modal title="Your consultation space" onClose={() => setVideoOpen(false)}>
          <div className="grid place-items-center gap-3 rounded-xl bg-slate-900 p-8 text-white">
            <Avatar name={state.profile.name} size="xl" />
            <p>{state.profile.name}</p>
            <Badge tone="gray">Camera preview · UI demo</Badge>
          </div>
          <p className={ui.muted}>
            This is a simulated waiting room. No camera, microphone, or live connection is active.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" aria-pressed={micOn} onClick={() => setMicOn(!micOn)}>
              Microphone icon: {micOn ? 'on' : 'off'}
            </Button>
            <Button onClick={() => setVideoOpen(false)}>Leave preview</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
