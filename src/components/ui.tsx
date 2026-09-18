import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  Star,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { useApp } from '../context/app-context'
import { initials, localDate } from '../lib/dates'
import { cn, ui } from '../lib/ui'
import type { Doctor } from '../types'

const buttonVariants = {
  primary: 'border-teal-700 bg-teal-700 text-white hover:bg-teal-800',
  secondary: 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50',
  ghost: 'border-transparent bg-transparent text-teal-700 hover:bg-teal-50',
  danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants
}) {
  return (
    <button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Avatar({
  name,
  src,
  size = 'md',
  color,
}: {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}) {
  const [failed, setFailed] = useState(false)
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-24 w-24 text-2xl',
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 font-semibold text-emerald-900',
        sizes[size],
      )}
      style={{ backgroundColor: color }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-[50%_30%]"
        />
      ) : (
        <span aria-label={name}>{initials(name)}</span>
      )}
    </span>
  )
}

export function Badge({
  children,
  tone = 'green',
}: {
  children: ReactNode
  tone?: 'green' | 'blue' | 'orange' | 'gray' | 'red' | 'purple'
}) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-sky-50 text-sky-700',
    orange: 'bg-amber-50 text-amber-700',
    gray: 'bg-slate-100 text-slate-600',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-violet-50 text-violet-700',
  }
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            {eyebrow}
          </p>
        )}
        <h1 className={ui.heading}>{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  )
}

export function SectionHeading({
  title,
  subtitle,
  to,
  linkText = 'View all',
  children,
}: {
  title: string
  subtitle?: string
  to?: string
  linkText?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {to ? (
        <Link to={to} className={ui.link}>
          {linkText}
          <ArrowRight size={16} />
        </Link>
      ) : (
        children
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  children,
}: {
  icon?: LucideIcon
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-700">
        <Icon size={28} />
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}

export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={cn(
        'fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-0 bg-transparent p-0 text-left outline-none backdrop:bg-slate-950/40',
        wide ? 'max-w-3xl' : 'max-w-xl',
      )}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button className={ui.iconButton} aria-label="Close dialog" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </dialog>
  )
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { state, toggleFavorite } = useApp()
  const saved = state.favorites.includes(doctor.id)
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className="relative grid min-h-40 place-items-center bg-emerald-50 p-6"
        style={{ backgroundColor: doctor.color }}
      >
        <Avatar name={doctor.name} src={doctor.image} size="xl" color={doctor.color} />
        {doctor.accepting && doctor.verified && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available
          </span>
        )}
        <button
          className={cn(
            'absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-red-600',
            saved && 'text-red-600',
          )}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${doctor.name}`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(doctor.id)}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to={`/doctors/${doctor.id}`}
              className="font-semibold text-slate-900 hover:text-teal-700"
            >
              {doctor.name}
            </Link>
            {doctor.verified && (
              <span
                className="grid h-4 w-4 place-items-center rounded-full bg-teal-600 text-white"
                title="Verified demo profile"
              >
                <Check size={10} strokeWidth={3} />
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1 text-amber-600">
            <Star size={13} fill="currentColor" /> <strong>{doctor.rating}</strong>
            <span className="text-slate-400">({doctor.reviews} reviews)</span>
          </span>
          <span>{doctor.experience} yrs exp.</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">
            <strong className="text-base text-slate-900">${doctor.fee}</strong> / visit
          </span>
          <Link to={`/doctors/${doctor.id}`} className={ui.link}>
            View profile
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  tone = 'teal',
  children,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  note: string
  tone?: string
  children?: ReactNode
}) {
  const tones: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700',
    blue: 'bg-sky-50 text-sky-700',
    purple: 'bg-violet-50 text-violet-700',
    peach: 'bg-rose-50 text-rose-700',
  }
  return (
    <div className={cn(ui.card, 'space-y-4')}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span
          className={cn('grid h-10 w-10 place-items-center rounded-lg', tones[tone] ?? tones.teal)}
        >
          <Icon size={19} />
        </span>
      </div>
      <div className="text-3xl font-semibold text-slate-900">
        {value}
        {children}
      </div>
      <div className="text-sm leading-6 text-slate-500">{note}</div>
    </div>
  )
}

export function MiniCalendar({ appointmentDates }: { appointmentDates: string[] }) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const firstDay = (month.getDay() + 6) % 7
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button
            className={ui.iconButton}
            aria-label="Previous month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className={ui.iconButton}
            aria-label="Next month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <span key={`day-${index}`} className="py-1 text-xs font-semibold text-slate-400">
            {day}
          </span>
        ))}
        {Array.from({ length: firstDay }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: total }, (_, index) => {
          const date = localDate(new Date(month.getFullYear(), month.getMonth(), index + 1))
          const hasAppointment = appointmentDates.includes(date)
          return (
            <Link
              aria-label={`${date}${hasAppointment ? ', appointment scheduled' : ''}`}
              to={`/appointments?date=${date}`}
              key={date}
              className={cn(
                'relative grid aspect-square place-items-center rounded-lg text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700',
                date === localDate() &&
                  'bg-slate-900 text-white hover:bg-slate-900 hover:text-white',
                hasAppointment && date !== localDate() && 'bg-teal-50 font-semibold text-teal-700',
              )}
            >
              {index + 1}
              {hasAppointment && (
                <i className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-600" />
              )}
            </Link>
          )
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="h-2 w-2 rounded-full bg-teal-600" />
        Appointment scheduled
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600" role="status">
      <div className="grid place-items-center gap-3">
        <CalendarDays className="animate-pulse text-teal-700" size={32} />
        <p className="text-sm font-medium">Getting your care ready...</p>
      </div>
    </div>
  )
}
