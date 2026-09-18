import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link } from 'react-router'
import { useState } from 'react'
import { useApp } from '../context/app-context'
import { Avatar, Badge, PageHeading, SectionHeading, StatCard } from '../components/ui'
import { DOCTOR_ID } from '../data/mock-data'
import { dayFromToday, formatDate, formatTime, localDate } from '../lib/dates'
import { sortAppointments } from '../lib/appointments'

export default function WorkspaceDashboard() {
  const { state } = useApp()
  const [range, setRange] = useState(7)
  const admin = state.role === 'admin'
  const ownDoctor = state.doctors.find((item) => item.id === DOCTOR_ID)!
  const visits = state.appointments.filter((item) => admin || item.doctorId === DOCTOR_ID)
  const scheduled = sortAppointments(visits.filter((item) => item.status === 'Confirmed'))
  const completed = visits.filter((item) => item.status === 'Completed')
  const patients = new Set(visits.map((item) => item.patientId)).size
  const chart = Array.from({ length: range }, (_, index) => ({
    date: dayFromToday(index),
    count: scheduled.filter((item) => item.date === dayFromToday(index)).length,
  }))
  const maximum = Math.max(...chart.map((item) => item.count), 3)
  return (
    <div className={ui.page}>
      <PageHeading
        title={
          admin
            ? 'A healthier community starts here.'
            : `Welcome back, ${ownDoctor.name.split(' ').slice(0, 2).join(' ')}.`
        }
        description={
          admin
            ? 'Your care network, connected and under control.'
            : 'Your patients, your schedule, and more room to focus on care.'
        }
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <CalendarDays size={16} />
          {formatDate(localDate())}
        </span>
      </PageHeading>
      <section className="flex flex-col gap-5 rounded-2xl bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-teal-200">
          {admin ? <ShieldCheck size={33} /> : <Stethoscope size={33} />}
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
            {admin ? 'Admin workspace' : 'Your care workspace'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {admin ? 'Good care takes a great team.' : 'Make every appointment meaningful.'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {admin
              ? `${state.doctors.length} doctors. ${patients} patients. One connected care experience.`
              : `You have ${scheduled.filter((item) => item.date === localDate()).length} scheduled visits today.`}
          </p>
        </div>
        <Link
          to={admin ? '/manage-doctors' : '/appointments'}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-900"
        >
          {admin ? 'Manage care team' : 'View schedule'}
          <ArrowRight size={17} />
        </Link>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Scheduled appointments"
          value={scheduled.length}
          note="Across your upcoming schedule"
        />
        <StatCard
          icon={Users}
          label={admin ? 'Registered patients' : 'Your patients'}
          value={patients}
          note="People at the heart of your care"
          tone="blue"
        />
        <StatCard
          icon={admin ? Stethoscope : CheckCircle2}
          label={admin ? 'Active doctors' : 'Completed visits'}
          value={
            admin
              ? state.doctors.filter((item) => item.accepting && item.verified).length
              : completed.length
          }
          note={admin ? 'Verified and accepting visits' : 'Thoughtful care, delivered'}
          tone="purple"
        />
        <StatCard
          icon={admin ? ShieldCheck : DollarSign}
          label={admin ? 'Pending verification' : 'Completed visit value'}
          value={
            admin
              ? state.doctors.filter((item) => !item.verified).length
              : `$${completed.reduce((sum, item) => sum + (state.doctors.find((doctor) => doctor.id === item.doctorId)?.fee ?? 0), 0)}`
          }
          note={admin ? 'Profiles ready for review' : 'Illustrative fees only'}
          tone="peach"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={cn(ui.panel, 'p-5')}>
          <SectionHeading
            title="Appointments at a glance"
            subtitle="Upcoming visits across your care calendar."
          >
            <select
              aria-label="Chart date range"
              className={ui.select}
              value={range}
              onChange={(event) => setRange(Number(event.target.value))}
            >
              <option value={7}>Next 7 days</option>
              <option value={14}>Next 14 days</option>
            </select>
          </SectionHeading>
          <div className="mb-4 flex items-end gap-2">
            <strong className="text-3xl text-slate-900">
              {chart.reduce((sum, item) => sum + item.count, 0)}
            </strong>
            <span className="pb-1 text-sm text-slate-500">scheduled visits</span>
            <Badge>Next {range} days</Badge>
          </div>
          <div
            className="flex h-56 items-end gap-3 rounded-xl bg-slate-50 p-4"
            role="img"
            aria-label={chart
              .map(
                (item) =>
                  `${formatDate(item.date, { month: 'short', day: 'numeric' })}: ${item.count} appointments`,
              )
              .join(', ')}
          >
            {chart.map((item) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={item.date}>
                <div className="flex h-40 w-full items-end rounded-full bg-white p-1">
                  <span
                    className={cn(
                      'relative w-full rounded-full bg-teal-600',
                      item.date === localDate() && 'bg-slate-900',
                    )}
                    style={{ height: `${Math.max((item.count / maximum) * 100, 3)}%` }}
                    title={`${item.count} visits`}
                  />
                </div>
                <small className="text-xs text-slate-500">
                  {formatDate(item.date, range === 7 ? { weekday: 'short' } : { day: 'numeric' })}
                </small>
              </div>
            ))}
          </div>
        </section>
        <section className={cn(ui.panel, 'p-5')}>
          <SectionHeading title={admin ? 'Ready for review' : 'Your practice'} />
          {admin ? (
            <div className="space-y-4">
              {state.doctors
                .filter((item) => !item.verified)
                .map((doctor) => (
                  <div
                    className="flex gap-3 rounded-xl border border-slate-200 p-3"
                    key={doctor.id}
                  >
                    <Avatar name={doctor.name} color={doctor.color} />
                    <div>
                      <strong className="text-sm text-slate-900">{doctor.name}</strong>
                      <p className="text-sm text-slate-500">{doctor.specialty}</p>
                      <Badge tone="orange">Awaiting verification</Badge>
                    </div>
                  </div>
                ))}
              {state.doctors.every((item) => item.verified) && (
                <p className={ui.muted}>All doctor profiles are verified. You’re up to date.</p>
              )}
              <Link
                to="/manage-doctors"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                Review profiles
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid place-items-center gap-3 text-center">
              <Avatar name={ownDoctor.name} src={ownDoctor.image} size="lg" />
              <div>
                <h3 className="font-semibold text-slate-900">{ownDoctor.name}</h3>
                <p className="text-sm text-slate-500">{ownDoctor.specialty}</p>
              </div>
              <Badge tone={ownDoctor.accepting ? 'green' : 'gray'}>
                {ownDoctor.accepting ? 'Accepting appointments' : 'Bookings paused'}
              </Badge>
              <Link
                to="/doctor-profile"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                Manage my profile
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </div>
      <section className={cn(ui.panel, 'overflow-hidden p-5')}>
        <SectionHeading
          title="Next on the calendar"
          to="/appointments"
          linkText="View all appointments"
        />
        <div className="overflow-x-auto">
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Patient</th>
                {admin && <th>Doctor</th>}
                <th>Date & time</th>
                <th>Visit type</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduled.slice(0, 5).map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={appointment.patientName} size="sm" />
                      <div>
                        <strong className="block text-sm text-slate-900">
                          {appointment.patientName}
                        </strong>
                        <small>{appointment.reason}</small>
                      </div>
                    </div>
                  </td>
                  {admin && (
                    <td>{state.doctors.find((item) => item.id === appointment.doctorId)?.name}</td>
                  )}
                  <td>
                    <span>{formatDate(appointment.date, { month: 'short', day: 'numeric' })}</span>
                    <small className="mt-1 flex items-center gap-1 text-slate-400">
                      <Clock3 size={12} />
                      {formatTime(appointment.time)}
                    </small>
                  </td>
                  <td>{appointment.type}</td>
                  <td>
                    <Badge>{appointment.status}</Badge>
                  </td>
                  <td>
                    <Link className={ui.link} to={`/appointments?detail=${appointment.id}`}>
                      Details
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!scheduled.length && (
            <p className="py-8 text-center text-sm text-slate-500">
              There are no scheduled appointments.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
