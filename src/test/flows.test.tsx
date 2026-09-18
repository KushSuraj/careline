import { act, render, screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Outlet, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppProvider } from '../context/AppProvider'
import { useApp, type AppContextValue } from '../context/app-context'
import { ProtectedRoute } from '../App'
import Layout from '../components/Layout'
import Booking from '../pages/Booking'
import Doctors from '../pages/Doctors'
import Login from '../pages/Login'
import Register from '../pages/Register/Register'
import { createInitialState } from '../data/mock-data'
import { dayFromToday } from '../lib/dates'
import { saveDemoState } from '../lib/storage'

let app: AppContextValue
function Capture() {
  const current = useApp()
  useEffect(() => {
    app = current
  }, [current])
  return <Outlet />
}
function renderPage(element: React.ReactElement, path = '/', route = '*') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider>
        <Routes>
          <Route element={<Capture />}>
            <Route path={route} element={element} />
          </Route>
        </Routes>
      </AppProvider>
    </MemoryRouter>,
  )
}

describe('patient interactions', () => {
  it('filters doctors by name and specialty', async () => {
    const user = userEvent.setup()
    renderPage(<Doctors />)
    await user.type(screen.getByLabelText('Search doctors'), 'Sarah')
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Michael Williams')).not.toBeInTheDocument()
    await user.clear(screen.getByLabelText('Search doctors'))
    await user.click(screen.getByRole('button', { name: 'Dermatologist' }))
    expect(screen.getByText('Dr. Emily Chen')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument()
  })
  it('saves and unsaves a doctor', async () => {
    const user = userEvent.setup()
    renderPage(<Doctors />)
    await user.click(screen.getByRole('button', { name: 'Save Dr. Michael Williams' }))
    expect(app.state.favorites).toContain('michael-williams')
    await user.click(screen.getByRole('button', { name: 'Unsave Dr. Michael Williams' }))
    expect(app.state.favorites).not.toContain('michael-williams')
  })
  it('books through all three steps and persists the confirmation', async () => {
    const user = userEvent.setup()
    renderPage(<Booking />, '/book/michael-williams', '/book/:doctorId')
    await user.click(screen.getByRole('button', { name: '1:30 PM' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await user.type(screen.getByLabelText('Reason for your visit'), 'A routine checkup')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Review appointment' }))
    await user.click(screen.getByRole('button', { name: 'Confirm appointment' }))
    expect(
      await screen.findByRole('heading', { name: 'Your next step to better health.' }),
    ).toBeInTheDocument()
    const booking = app.state.appointments.find((item) => item.reason === 'A routine checkup')!
    expect(booking.status).toBe('Confirmed')
    expect(booking.time).toBe('13:30')
  })
  it('rejects rapid duplicate booking transactions', () => {
    renderPage(<div />)
    const input = {
      doctorId: 'michael-williams',
      date: dayFromToday(4),
      time: '13:30',
      type: 'In-person' as const,
      reason: 'A routine checkup',
    }
    act(() => {
      expect(app.bookAppointment(input).appointment).toBeDefined()
      expect(app.bookAppointment(input).error).toContain('already booked')
    })
  })
  it('cancels a visit and prevents a patient marking it completed', () => {
    renderPage(<div />)
    act(() => {
      app.setAppointmentStatus('CL-2048', 'Completed')
    })
    expect(app.state.appointments.find((item) => item.id === 'CL-2048')?.status).toBe('Confirmed')
    act(() => {
      app.setAppointmentStatus('CL-2048', 'Cancelled')
    })
    expect(app.state.appointments.find((item) => item.id === 'CL-2048')?.status).toBe('Cancelled')
  })
})

describe('demo role navigation', () => {
  it('redirects a patient away from an admin-only route', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AppProvider>
          <Routes>
            <Route path="/" element={<p>Patient overview</p>} />
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<p>Admin private screen</p>} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByText('Patient overview')).toBeInTheDocument()
    expect(screen.queryByText('Admin private screen')).not.toBeInTheDocument()
  })
  it('redirects signed-out users to the sign-in page', async () => {
    const state = createInitialState()
    state.signedIn = false
    saveDemoState(state)
    render(
      <MemoryRouter initialEntries={['/appointments']}>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<p>Sign in here</p>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/appointments" element={<p>Appointments screen</p>} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByText('Sign in here')).toBeInTheDocument()
  })
  it('signs in from the login form without saving credentials', async () => {
    const state = createInitialState()
    state.signedIn = false
    saveDemoState(state)
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppProvider>
          <Routes>
            <Route element={<Capture />}>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<p>Demo workspace</p>} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>,
    )
    await user.type(screen.getByLabelText('Email address'), 'maya@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(app.state.role).toBe('patient'))
    expect(app.state.signedIn).toBe(true)
    expect(JSON.stringify(app.state)).not.toContain('password')
  })
  it('creates an account from the register form', async () => {
    const state = createInitialState()
    state.signedIn = false
    saveDemoState(state)
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppProvider>
          <Routes>
            <Route element={<Capture />}>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<p>Registered workspace</p>} />
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>,
    )
    await user.type(screen.getByLabelText('Full name'), 'Maya Patel')
    await user.type(screen.getByLabelText('Email address'), 'maya@example.com')
    await user.type(screen.getByLabelText('Phone number'), '+1 555 0100')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(app.state.signedIn).toBe(true))
    expect(screen.getByText('Registered workspace')).toBeInTheDocument()
  })
  it('logs out from the account area and returns to sign-in', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<p>Sign in here</p>} />
            <Route element={<Capture />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<p>Demo workspace</p>} />
              </Route>
            </Route>
          </Routes>
        </AppProvider>
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Log out' }))
    await waitFor(() => expect(app.state.signedIn).toBe(false))
    expect(screen.getByText('Sign in here')).toBeInTheDocument()
  })
})
