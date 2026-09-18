import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router'
import type { z } from 'zod'
import { useApp } from '../../context/app-context'
import { registerSchema } from '../../lib/schemas'
import { cn } from '../../lib/ui'

type RegisterForm = z.infer<typeof registerSchema>

const inputClass =
  'peer h-10 w-full rounded-sm shadow-sm bg-white pl-11 pr-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus:border-rose-500 aria-[invalid=true]:focus:ring-rose-500/10'

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null

  return (
    <p id={id} className="flex items-center gap-1.5 text-xs font-medium text-rose-600" role="alert">
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {children}
    </p>
  )
}

function FieldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Icon
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition peer-focus:text-teal-700"
      size={18}
      aria-hidden="true"
    />
  )
}

export default function Register() {
  const { state, signIn } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    document.title = 'Create your account · Careline'
  }, [])

  if (state.signedIn) return <Navigate to="/" replace />

  const createAccount = () => {
    signIn('patient')
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-dvh bg-[#f7faf9] text-slate-950">
      <div className="mx-auto grid min-h-dvh max-w-360 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden min-h-dvh overflow-hidden bg-[#073b3a] p-8 text-white lg:flex lg:flex-col xl:p-12">
          <div
            className="absolute -right-28 top-12 h-72 w-72 rounded-full border-56 border-white/5"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full border-64 border-teal-300/10"
            aria-hidden="true"
          />

          <Link
            to="/"
            className="relative z-10 inline-flex w-fit items-center gap-3 text-xl font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-200"
            aria-label="Careline home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-300 text-[#073b3a] shadow-lg shadow-black/10">
              <Plus size={24} strokeWidth={3.2} />
            </span>
            <span>
              careline<span className="text-teal-300">.</span>
            </span>
          </Link>

          <div className="relative z-10 my-auto max-w-xl py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-100">
              <Sparkles size={14} aria-hidden="true" />
              Your health, beautifully organized
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Better care starts with one simple account.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-teal-50/75 xl:text-lg xl:leading-8">
              Book trusted doctors, manage upcoming visits, and keep your health journey moving in
              one secure place.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-teal-50/70">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-teal-200">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <span>Private by design. Your care details stay protected.</span>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-16">
          <div className="w-full max-w-152">
            <header className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-950"
                aria-label="Careline home"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white">
                  <Plus size={22} strokeWidth={3.2} />
                </span>
                <span>
                  careline<span className="text-teal-700">.</span>
                </span>
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-teal-800 transition hover:text-teal-950"
              >
                Sign in
              </Link>
            </header>

            <div className="rounded-4xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-9 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-teal-700">Create your account</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
                    Let’s get you started
                  </h2>
                  <p className="mt-3 max-w-lg text-[15px] leading-6 text-slate-500">
                    It only takes a minute. Add your details to build your patient profile.
                  </p>
                </div>
                <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700 sm:grid lg:hidden xl:grid">
                  <UserRound size={22} aria-hidden="true" />
                </span>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit(createAccount)} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        className={inputClass}
                        {...register('name')}
                        placeholder="Aarav Sharma"
                        autoComplete="name"
                        autoFocus
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <FieldIcon icon={UserRound} />
                    </div>
                    <FieldError id="name-error">{errors.name?.message}</FieldError>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        className={inputClass}
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                        spellCheck={false}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      <FieldIcon icon={Mail} />
                    </div>
                    <FieldError id="email-error">{errors.email?.message}</FieldError>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                      Phone number
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        className={inputClass}
                        type="tel"
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        inputMode="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      <FieldIcon icon={Phone} />
                    </div>
                    <FieldError id="phone-error">{errors.phone?.message}</FieldError>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        className={cn(inputClass, 'pr-12')}
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                      />
                      <FieldIcon icon={LockKeyhole} />
                      <button
                        type="button"
                        className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password ? (
                      <FieldError id="password-error">{errors.password.message}</FieldError>
                    ) : (
                      <p id="password-hint" className="text-xs text-slate-400">
                        Use 8 or more characters
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        className={cn(inputClass, 'pr-12')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                          errors.confirmPassword ? 'confirm-password-error' : undefined
                        }
                      />
                      <FieldIcon icon={LockKeyhole} />
                      <button
                        type="button"
                        className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showConfirmPassword}
                        onClick={() => setShowConfirmPassword((visible) => !visible)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FieldError id="confirm-password-error">
                      {errors.confirmPassword?.message}
                    </FieldError>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-sm leading-5 text-teal-900">
                  <Check className="mt-0.5 shrink-0 text-teal-700" size={16} aria-hidden="true" />
                  <p>By creating an account, you agree to our Terms and Privacy Policy.</p>
                </div>

                <button
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-teal-700 px-5 text-[15px] font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:pointer-events-none disabled:opacity-60"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <div className="mt-7 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Already registered?
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="mt-5 text-center text-sm text-slate-600">
                Welcome back.{' '}
                <Link
                  to="/login"
                  className="font-semibold text-teal-700 underline-offset-4 transition hover:text-teal-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Sign in to your account
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400 lg:text-left">
              Your information is used only to set up your Careline patient experience.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
