import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Heart,
  Languages,
  MapPin,
  ShieldCheck,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link, useParams } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Badge, Button, EmptyState, SectionHeading } from '../components/ui'

export default function DoctorProfile() {
  const { doctorId } = useParams()
  const { state, toggleFavorite } = useApp()
  const doctor = state.doctors.find((item) => item.id === doctorId && item.verified)
  if (!doctor)
    return (
      <EmptyState
        title="Doctor profile unavailable"
        description="This profile may not be published yet."
      >
        <Link
          to="/doctors"
          className="inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
        >
          Explore doctors
        </Link>
      </EmptyState>
    )
  const saved = state.favorites.includes(doctor.id)
  return (
    <div className={ui.page}>
      <Link className={ui.link} to="/doctors">
        <ArrowLeft size={16} />
        Back to doctors
      </Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className={cn(ui.panel, 'overflow-hidden')}>
            <div className="h-28 bg-teal-700" />
            <div className="space-y-6 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:-mt-16 md:flex-row md:items-end">
                <Avatar name={doctor.name} src={doctor.image} size="xl" color={doctor.color} />
                <div className="flex-1">
                  <Badge>
                    <ShieldCheck size={12} />
                    Verified specialist
                  </Badge>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900">{doctor.name}</h1>
                  <p className="mt-1 text-slate-500">{doctor.specialty}</p>
                  <p className="mt-1 text-sm text-slate-500">{doctor.qualification}</p>
                </div>
                <Button
                  variant="secondary"
                  aria-pressed={saved}
                  onClick={() => toggleFavorite(doctor.id)}
                >
                  <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save doctor'}
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [Star, `${doctor.rating} / 5`, `${doctor.reviews} patient reviews`],
                  [Stethoscope, `${doctor.experience} years`, 'Clinical experience'],
                  [Languages, `${doctor.languages.length} languages`, doctor.languages.join(', ')],
                ].map(([Icon, value, label]) => (
                  <div key={String(label)} className="rounded-xl bg-slate-50 p-4">
                    <Icon className="text-teal-700" size={20} />
                    <strong className="mt-3 block text-slate-900">{String(value)}</strong>
                    <span className="text-sm text-slate-500">{String(label)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className={cn(ui.panel, 'space-y-5 p-5')}>
            <SectionHeading title={`Meet ${doctor.name}`} />
            <p className={ui.muted}>{doctor.bio}</p>
            <h3 className={ui.subheading}>A personal approach to your wellbeing</h3>
            <p className={ui.muted}>
              Every visit is a conversation. Expect time to discuss your concerns, understand your
              options, and plan your next steps together.
            </p>
            {[
              [GraduationCap, 'Education & expertise', doctor.qualification],
              [MapPin, doctor.location, 'San Francisco, California · Sample clinic location'],
              [Clock3, 'Consultation hours', 'Daily · 9:00 AM-4:30 PM · 30-minute visits'],
            ].map(([Icon, title, text]) => (
              <div
                key={String(title)}
                className="flex gap-3 rounded-xl border border-slate-200 p-4"
              >
                <Icon className="text-teal-700" size={21} />
                <div>
                  <strong className="text-sm text-slate-900">{String(title)}</strong>
                  <p className="mt-1 text-sm text-slate-500">{String(text)}</p>
                </div>
              </div>
            ))}
          </section>
          <section className={cn(ui.panel, 'space-y-4 p-5')}>
            <SectionHeading title="What patients are saying">
              <Badge tone="orange">
                <Star size={12} fill="currentColor" />
                {doctor.rating} out of 5
              </Badge>
            </SectionHeading>
            {[
              [
                'Jordan M.',
                'I felt listened to from the very first minute. Everything was explained clearly.',
              ],
              ['Taylor R.', 'A smooth booking experience and a thoughtful consultation.'],
            ].map(([name, quote]) => (
              <div className="rounded-xl border border-slate-200 p-4" key={name}>
                <div className="flex items-center gap-3">
                  <Avatar name={name} size="sm" />
                  <strong className="text-sm text-slate-900">{name}</strong>
                  <span className="text-sm text-amber-500">★★★★★</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">"{quote}"</p>
              </div>
            ))}
          </section>
        </div>
        <aside>
          <div className={cn(ui.panel, 'sticky top-24 space-y-4 p-5')}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Your next step to better health
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">Let’s make time for you.</h2>
            <p className={ui.muted}>Book a visit that fits your schedule.</p>
            <div className="rounded-xl bg-slate-50 p-4">
              <strong className="text-3xl text-slate-900">${doctor.fee}</strong>
              <span className="text-sm text-slate-500"> / consultation</span>
            </div>
            {[
              [MapPin, 'In-person visit', 'A little care, face to face'],
              [Video, 'Video consultation', 'Care from the comfort of home'],
            ].map(([Icon, title, text]) => (
              <div
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                key={String(title)}
              >
                <Icon className="text-teal-700" size={19} />
                <div className="flex-1">
                  <strong className="text-sm text-slate-900">{String(title)}</strong>
                  <p className="text-xs text-slate-500">{String(text)}</p>
                </div>
                <Check size={16} className="text-teal-700" />
              </div>
            ))}
            {doctor.accepting ? (
              <Link
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
                to={`/book/${doctor.id}`}
              >
                <CalendarDays size={17} />
                Book appointment
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Button disabled className="w-full">
                Not accepting appointments
              </Button>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
              <ShieldCheck size={15} />
              <span>No payment required in this demo</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
