/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, useEffect } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  useLocation,
} from 'react-router'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { EmptyState, LoadingScreen } from './components/ui'
import Dashboard from './pages/Dashboard'

const Doctors = lazy(() => import('./pages/Doctors'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))
const Booking = lazy(() => import('./pages/Booking'))
const Appointments = lazy(() => import('./pages/Appointments'))
const Records = lazy(() => import('./pages/Records'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const Management = lazy(() => import('./pages/Management'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppFrame() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </>
  )
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppFrame />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="settings" element={<Settings />} />
          <Route element={<ProtectedRoute roles={['patient']} />}>
            <Route path="doctors" element={<Doctors />} />
            <Route path="saved" element={<Doctors savedOnly />} />
            <Route path="doctors/:doctorId" element={<DoctorProfile />} />
            <Route path="book/:doctorId" element={<Booking />} />
            <Route path="records" element={<Records />} />
          </Route>
          <Route element={<ProtectedRoute roles={['doctor', 'admin']} />}>
            <Route path="patients" element={<Management mode="patients" />} />
          </Route>
          <Route element={<ProtectedRoute roles={['doctor']} />}>
            <Route path="doctor-profile" element={<Management mode="profile" />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="manage-doctors" element={<Management mode="doctors" />} />
          </Route>
          <Route
            path="*"
            element={
              <EmptyState
                title="This page took a wrong turn"
                description="Let’s get you back to your care dashboard."
              >
                <Link
                  className="inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
                  to="/"
                >
                  Back to overview
                </Link>
              </EmptyState>
            }
          />
        </Route>
      </Route>
    </Route>,
  ),
)
