import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  CalendarCheck2,
  Eye,
  EyeOff,
  HeartPulse,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router'
import type { z } from 'zod'
import { Logo } from '../../components/Layout'
import { Button } from '../../components/ui'
import { useApp } from '../../context/app-context'
import { registerSchema } from '../../lib/schemas'
import { ui } from '../../lib/ui'

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { state, signIn } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  if (state.signedIn) return <Navigate to="/" replace />

  const createAccount = () => {
    signIn('patient')
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#f6faf8] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_38rem] lg:px-8">
        <section className="relative hidden overflow-hidden rounded-[2rem] bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <Link
            to="/"
            className="relative inline-flex items-center gap-3 text-2xl font-bold text-white"
            aria-label="Careline home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <Plus size={27} strokeWidth={3.4} />
            </span>
            <span>
              careline<span className="text-teal-200">.</span>
            </span>
          </Link>
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
              Patient access
            </p>
            <h1 className="mt-5 text-6xl font-semibold leading-tight tracking-tight">
              Start care with a profile that stays organized.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200">
              Create one account for appointment booking, visit tracking, care reminders, and saved
              doctors.
            </p>
          </div>
          <div className="relative grid max-w-xl grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
              <CalendarCheck2 size={27} className="text-teal-200" />
              <strong className="mt-4 block text-2xl">Fast</strong>
              <span className="text-sm text-slate-200">Booking setup</span>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
              <HeartPulse size={27} className="text-teal-200" />
              <strong className="mt-4 block text-2xl">Simple</strong>
              <span className="text-sm text-slate-200">Care history</span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-2xl py-8">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>
            <div className="rounded-[2rem] bg-white/85 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/70 backdrop-blur sm:p-9 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Create account
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                Build your patient profile
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500">
                Add your details once and use them across appointments, saved doctors, and care
                updates.
              </p>

              <form className="mt-9 space-y-6" onSubmit={handleSubmit(createAccount)} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className={`${ui.label} md:col-span-2`}>
                    <span>Full name</span>
                    <input
                      className="min-h-10 w-full rounded-sm border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      {...register('name')}
                      placeholder="Aarav Sharma"
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
                      className="min-h-10 w-full rounded-sm border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      type="email"
                      {...register('email')}
                      placeholder="you@example.com"
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
                      className="min-h-10 w-full rounded-sm border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                      {...register('phone')}
                      placeholder="+91 98765 43210"
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
                    <span>Password</span>
                    <div className="flex rounded-sm border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                      <input
                        className="min-h-10 rounded-sm flex-1 bg-transparent px-4 text-base outline-none placeholder:text-slate-400"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        className={ui.iconButton}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <small className={ui.error} role="alert">
                        {errors.password.message}
                      </small>
                    )}
                  </label>

                  <label className={ui.label}>
                    <span>Confirm password</span>
                    <div className="flex rounded-sm border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                      <input
                        className="min-h-10 rounded-sm flex-1 bg-transparent px-4 text-base outline-none placeholder:text-slate-400"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button
                        type="button"
                        className={ui.iconButton}
                        aria-label={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <small className={ui.error} role="alert">
                        {errors.confirmPassword.message}
                      </small>
                    )}
                  </label>
                </div>

                <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-800">
                  <ShieldCheck className="mr-2 inline" size={18} />
                  Your account opens a patient workspace with protected routes and local preview
                  state.
                </div>

                <Button className="min-h-14 w-full text-base" type="submit">
                  Create account
                  <ArrowRight size={17} />
                </Button>
              </form>

              <p className="mt-7 text-center text-base text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-teal-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
