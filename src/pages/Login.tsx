import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CalendarDays, Eye, EyeOff, Plus, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Logo } from '../components/Layout'
import { Button } from '../components/ui'
import { ui } from '../lib/ui'
import { loginSchema } from '../lib/schemas'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  return (
    <main className="min-h-screen bg-[#f6faf8] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_34rem] lg:px-8">
        <section className="relative hidden overflow-hidden rounded-4xl bg-teal-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-2xl font-bold text-white"
            aria-label="Careline home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <Plus size={27} strokeWidth={3.4} />
            </span>
            <span>
              careline<span className="text-teal-200">.</span>
            </span>
          </Link>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
              Careline patient portal
            </p>
            <h1 className="mt-5 text-6xl font-semibold leading-tight tracking-tight">
              Care feels easier when everything is in one place.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-teal-50">
              Sign in to manage appointments, review visit details, and keep your care journey
              organized.
            </p>
          </div>
          <div className="grid max-w-xl grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-5">
              <CalendarDays size={26} />
              <strong className="mt-4 block text-2xl">24/7</strong>
              <span className="text-sm text-teal-50">Appointment access</span>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <ShieldCheck size={26} />
              <strong className="mt-4 block text-2xl">Private</strong>
              <span className="text-sm text-teal-50">Patient workspace</span>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl py-8">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>
            <div className="rounded-4xl bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/70 backdrop-blur md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Welcome back
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                Sign in to your account
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500">
                Continue to your appointments, records, and care dashboard.
              </p>
              <form className="mt-9 space-y-6" noValidate>
                <label className={ui.label}>
                  <span>Email address</span>
                  <input
                    className="min-h-10 w-full rounded-sm shadow-sm bg-white px-4 text-base  outline-none transition placeholder:text-slate-400"
                    type="email"
                    {...register('email')}
                    placeholder="your_email@example.com"
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
                  <span>Password</span>
                  <div className="flex rounded-sm bg-white shadow-sm focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-300/10">
                    <input
                      className="min-h-10 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-slate-400"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="********"
                      autoComplete="current-password"
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
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="inline-flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                    />
                    Remember me
                  </label>
                  <button className="font-semibold text-teal-700" type="button">
                    Forgot password?
                  </button>
                </div>
                <Button className="min-h-14 w-full text-base" type="submit">
                  Sign in
                  <ArrowRight size={17} />
                </Button>
              </form>
              <p className="mt-7 text-center text-base text-slate-500">
                New to Careline?{' '}
                <Link to="/register" className="font-semibold text-teal-700">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
