import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  FileHeart,
  Heart,
  HeartPulse,
  MapPin,
  Plus,
  ShieldCheck,
  Stethoscope,
  Video,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link } from 'react-router'
import { useState } from 'react'
import { useApp } from '../context/app-context'
import {
  Avatar,
  Badge,
  DoctorCard,
  MiniCalendar,
  PageHeading,
  SectionHeading,
  StatCard,
} from '../components/ui'
import { formatDate, formatTime, localDate } from '../lib/dates'
import { sortAppointments } from '../lib/appointments'
import { PATIENT_ID } from '../data/mock-data'
import WorkspaceDashboard from './WorkspaceDashboard'

export default function Dashboard() {
  const { state } = useApp()
  const [now] = useState(Date.now)
  if (state.role !== 'patient') return <WorkspaceDashboard />
  const appointments = state.appointments.filter((item) => item.patientId === PATIENT_ID)
  const upcoming = sortAppointments(
    appointments.filter(
      (item) =>
        item.status === 'Confirmed' && new Date(`${item.date}T${item.time}:00`).getTime() > now,
    ),
  )
  const complete = appointments.filter((item) => item.status === 'Completed')
  const suggested = state.doctors.filter((item) => item.verified).slice(0, 4)

  return (
    <div className={ui.page}>
      <PageHeading
        title={`Good morning, ${state.profile.name.split(' ')[0]}`}
        description="A little care today, a healthier tomorrow. Let’s take care of you."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <CalendarDays size={16} />
          {formatDate(localDate(), {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </PageHeading>
      <section className="grid overflow-hidden rounded-2xl bg-teal-700 text-white lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5 p-6 md:p-8">
          <Badge tone="blue">
            <ShieldCheck size={12} />
            Healthcare UI demo
          </Badge>
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              Better health starts with the right care.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50">
              Connect with trusted specialists and book your next appointment with a clean,
              responsive interface.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-teal-800"
          >
            <Plus size={17} /> Book an appointment
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="relative hidden min-h-72 items-end justify-center bg-teal-600 p-6 lg:flex">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop&crop=faces"
            alt="A friendly healthcare professional"
            className="h-72 w-56 rounded-t-full object-cover object-[50%_25%]"
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <Stethoscope className="absolute text-white/15" size={180} />
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Upcoming appointments"
          value={upcoming.length.toString().padStart(2, '0')}
          note={
            upcoming[0]
              ? `Next visit on ${formatDate(upcoming[0].date, { month: 'short', day: 'numeric' })}`
              : 'Your next chapter of care'
          }
        />
        <StatCard
          icon={Check}
          label="Completed visits"
          value={complete.length.toString().padStart(2, '0')}
          note="Every visit, a step toward better health"
          tone="blue"
        />
        <StatCard
          icon={FileHeart}
          label="Medical records"
          value="04"
          note="All your health information, together"
          tone="purple"
        />
        <StatCard
          icon={Heart}
          label="Saved doctors"
          value={state.favorites.length.toString().padStart(2, '0')}
          note="Your trusted care team, one click away"
          tone="peach"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={cn(ui.panel, 'p-5')}>
          <SectionHeading
            title="Upcoming appointments"
            subtitle="Your next steps to feeling your best."
            to="/appointments"
          />
          <div className="grid gap-4">
            {upcoming.slice(0, 2).map((appointment) => {
              const doctor = state.doctors.find((item) => item.id === appointment.doctorId)!
              return (
                <article className="rounded-xl border border-slate-200 p-4" key={appointment.id}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-3">
                      <Avatar
                        name={doctor.name}
                        src={doctor.image}
                        size="lg"
                        color={doctor.color}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
                        <p className="text-sm text-slate-500">
                          {doctor.specialty} · {appointment.reason}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={15} />
                            {formatDate(appointment.date, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={15} />
                            {formatTime(appointment.time)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            {appointment.type === 'Video call' ? (
                              <Video size={15} />
                            ) : (
                              <MapPin size={15} />
                            )}
                            {appointment.type === 'Video call'
                              ? 'Video consultation'
                              : doctor.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge>{appointment.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/book/${doctor.id}?reschedule=${appointment.id}`}
                      className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700"
                    >
                      Reschedule
                    </Link>
                    <Link
                      to={`/appointments?detail=${appointment.id}`}
                      className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-teal-700 px-3 text-sm font-semibold text-white"
                    >
                      View details <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              )
            })}
            {!upcoming.length && (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <CalendarDays className="mx-auto text-teal-700" size={28} />
                <h3 className="mt-3 font-semibold text-slate-900">
                  A little room for your wellbeing
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Book your next visit with a doctor you trust.
                </p>
              </div>
            )}
          </div>
        </section>
        <aside className={cn(ui.panel, 'p-5')}>
          <SectionHeading title="Your care calendar">
            <CalendarDays size={18} />
          </SectionHeading>
          <MiniCalendar appointmentDates={upcoming.map((item) => item.date)} />
          <div className="mt-5 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            <HeartPulse size={20} />
            <p>A short break can make a big difference. Make a little time for you today.</p>
          </div>
        </aside>
      </div>
      <section>
        <SectionHeading
          title="Recommended for you"
          subtitle="Good people. Great care. Find your perfect fit."
          to="/doctors"
          linkText="Explore all doctors"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {suggested.map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor.id} />
          ))}
        </div>
      </section>
      <section className={cn(ui.panel, 'p-5')}>
        <SectionHeading title="Your health at a glance" to="/records" linkText="View records" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [HeartPulse, 'Heart rate', '72 bpm'],
            [Activity, 'Blood pressure', '120/80 mmHg'],
            [
              FileHeart,
              'Last checkup',
              formatDate(complete[0]?.date ?? localDate(), { month: 'short', day: 'numeric' }),
            ],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-teal-700">
                <Icon size={19} />
              </span>
              <div>
                <small className="text-xs text-slate-500">{String(label)}</small>
                <strong className="block text-slate-900">{String(value)}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
