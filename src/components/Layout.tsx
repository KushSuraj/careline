import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileHeart,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Button, EmptyState, Modal } from './ui'
import { DOCTOR_ID } from '../data/mock-data'
import type { Role } from '../types'

const patientLinks = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/doctors', label: 'Find a doctor', icon: Stethoscope },
  { to: '/appointments', label: 'My appointments', icon: CalendarDays },
  { to: '/records', label: 'Medical records', icon: FileHeart },
  { to: '/saved', label: 'Saved doctors', icon: Heart },
]
const doctorLinks = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patients', label: 'My patients', icon: Users },
  { to: '/doctor-profile', label: 'My profile', icon: Stethoscope },
]
const adminLinks = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/manage-doctors', label: 'Manage doctors', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patients', label: 'Patients', icon: Users },
]

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900"
      aria-label="Careline home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl rounded-bl bg-teal-700 text-white">
        <Plus size={24} strokeWidth={3.4} />
      </span>
      <span>
        careline<span className="text-teal-700">.</span>
      </span>
    </Link>
  )
}

export default function Layout() {
  const { state, switchRole, signOut, markNotificationsRead, storageAvailable } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isPatient = state.role === 'patient'
  const links = isPatient ? patientLinks : state.role === 'doctor' ? doctorLinks : adminLinks
  const notices = state.notifications.filter((item) => item.role === state.role)
  const unread = notices.filter((item) => !item.read).length
  const doctor = state.doctors.find((item) => item.id === DOCTOR_ID)
  const name = isPatient
    ? state.profile.name
    : state.role === 'doctor'
      ? (doctor?.name ?? 'Dr. Sarah Johnson')
      : 'Alex Morgan'
  const title =
    [...links, { to: '/settings', label: 'Settings' }].find((item) => item.to === location.pathname)
      ?.label ?? (location.pathname.startsWith('/book') ? 'Book an appointment' : 'Doctor profile')

  useEffect(() => {
    document.title = `${title} · Careline`
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [title])

  const navigation = (
    <>
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <Logo />
        <button
          className={cn(ui.iconButton, 'lg:hidden')}
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-5">
        <p className="my-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Your {isPatient ? 'health' : 'care'} space
        </p>
        <nav className="grid gap-1" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700',
                  isActive && 'bg-teal-50 text-teal-700',
                )
              }
            >
              <Icon size={18} strokeWidth={1.9} />
              <span className="flex-1">{label}</span>
              {to === '/appointments' && (
                <span className="grid min-w-6 place-items-center rounded bg-teal-100 px-1.5 py-0.5 text-xs text-teal-700">
                  {
                    state.appointments.filter(
                      (item) =>
                        item.status === 'Confirmed' &&
                        (isPatient
                          ? item.patientId === 'patient-maya'
                          : state.role === 'doctor'
                            ? item.doctorId === DOCTOR_ID
                            : true),
                    ).length
                  }
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-6 px-4">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Support
        </p>
        <div className="grid gap-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700',
                isActive && 'bg-teal-50 text-teal-700',
              )
            }
            onClick={() => setMobileOpen(false)}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            onClick={() => {
              setHelpOpen(true)
              setMobileOpen(false)
            }}
          >
            <CircleHelp size={18} />
            <span className="flex-1">Help & support</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-teal-700">
            <Heart size={18} />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">Care, close at hand.</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            A responsive UI demo using dummy data.
          </p>
          <button className={cn(ui.link, 'mt-3')} onClick={() => setHelpOpen(true)}>
            Visit help center
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <a
        className="fixed left-4 top-[-100px] z-[70] rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white focus:top-4"
        href="#main-content"
      >
        Skip to main content
      </a>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-72 -translate-x-full flex-col overflow-y-auto overscroll-contain border-r border-slate-200 bg-white pb-3 transition lg:translate-x-0',
          mobileOpen && 'translate-x-0',
        )}
        aria-label="Sidebar"
      >
        {navigation}
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className={cn(ui.iconButton, 'lg:hidden')}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>
            <span className="hidden items-center gap-2 text-sm text-slate-500 md:inline-flex">
              My workspace <span>/</span>{' '}
              <strong className="font-medium text-slate-700">{title}</strong>
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
            <form
              className="hidden max-w-xs flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 md:flex"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                navigate(
                  `${isPatient ? '/doctors' : '/appointments'}?q=${encodeURIComponent(search)}`,
                )
                setSearch('')
              }}
            >
              <Search size={16} />
              <input
                ref={searchRef}
                aria-label={isPatient ? 'Search doctors or specialties' : 'Search appointments'}
                placeholder={
                  isPatient ? 'Search doctors, specialties...' : 'Search appointments...'
                }
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </form>
            <label className="relative inline-flex items-center">
              <span className="sr-only">Demo role</span>
              <select
                aria-label="Demo role"
                value={state.role}
                onChange={(event) => {
                  switchRole(event.target.value as Role)
                  navigate('/')
                }}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white py-0 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              >
                <option value="patient">Patient view</option>
                <option value="doctor">Doctor view</option>
                <option value="admin">Admin view</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 text-slate-400"
                size={13}
              />
            </label>
            <button
              className={cn(ui.iconButton, 'relative')}
              aria-label={`Notifications, ${unread} unread`}
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>
            <Link
              to="/settings"
              className="hidden items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-100 sm:flex"
              aria-label="Open profile settings"
            >
              <Avatar
                name={name}
                src={state.role === 'doctor' ? doctor?.image : undefined}
                size="sm"
              />
              <span className="hidden flex-col leading-tight xl:flex">
                <strong className="text-xs font-semibold text-slate-800">{name}</strong>
                <small className="text-[11px] text-slate-500">
                  {isPatient
                    ? 'Personal account'
                    : state.role === 'doctor'
                      ? 'Doctor account'
                      : 'Administrator'}
                </small>
              </span>
            </Link>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              type="button"
              aria-label="Log out"
              onClick={() => {
                signOut()
                navigate('/login')
              }}
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Log out</span>
            </button>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto min-h-[calc(100vh-8rem)] max-w-7xl p-4 outline-none md:p-6"
          tabIndex={-1}
        >
          {!storageAvailable && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Browser storage is unavailable. Your changes will last until this page is refreshed.
            </div>
          )}
          <Outlet />
        </main>
        <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
          <span>© {new Date().getFullYear()} Careline. Made for better care.</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} /> Demo experience · All data is fictional
          </span>
        </footer>
      </div>
      {notificationsOpen && (
        <Modal title="Notifications" onClose={() => setNotificationsOpen(false)}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">{unread} unread notifications</span>
            <button className={ui.link} onClick={markNotificationsRead}>
              Mark all as read
            </button>
          </div>
          {notices.length ? (
            <div className="grid gap-3">
              {notices.map((notice) => (
                <div className="flex gap-3 rounded-xl border border-slate-200 p-4" key={notice.id}>
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700">
                    <Bell size={18} />
                  </span>
                  <div className="flex-1">
                    <strong className="text-sm text-slate-900">{notice.title}</strong>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{notice.message}</p>
                    <small className="text-xs text-slate-400">{notice.date}</small>
                  </div>
                  {!notice.read && <i className="mt-2 h-2 w-2 rounded-full bg-teal-600" />}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="You’re all caught up"
              description="Appointment updates will appear here."
            />
          )}
        </Modal>
      )}
      {helpOpen && (
        <Modal title="A little help, whenever you need it" onClose={() => setHelpOpen(false)}>
          <p className={ui.muted}>Get familiar with your Careline demo.</p>
          <div className="space-y-3">
            {[
              [
                'How do I book an appointment?',
                'Open Find a doctor, select a profile, and choose your visit type, date, and time.',
              ],
              [
                'Can I reschedule or cancel a visit?',
                'Yes. Open My appointments and choose Reschedule or view the appointment details to cancel.',
              ],
              [
                'How do I explore doctor and admin screens?',
                'Use the role selector in the header to switch views.',
              ],
            ].map(([summary, text]) => (
              <details
                key={summary}
                className="rounded-lg border border-slate-200 p-4"
                open={summary.startsWith('How do I book')}
              >
                <summary className="cursor-pointer font-semibold text-slate-800">{summary}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </details>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
            <Sparkles size={17} />
            <span>Built to explore a simpler, more connected care experience.</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              signOut()
              navigate('/login')
              setHelpOpen(false)
            }}
          >
            <LogOut size={16} /> Explore demo sign-in
          </Button>
        </Modal>
      )}
    </div>
  )
}
