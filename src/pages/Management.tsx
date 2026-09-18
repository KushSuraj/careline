import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Check,
  Download,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { Link } from 'react-router'
import { useApp } from '../context/app-context'
import { Avatar, Badge, Button, EmptyState, Modal, PageHeading } from '../components/ui'
import { DOCTOR_ID, specialties } from '../data/mock-data'
import { formatDate } from '../lib/dates'
import { csvCell, downloadText } from '../lib/downloads'
import type { Doctor } from '../types'

const doctorFormSchema = z.object({
  name: z.string().trim().min(5, 'Enter the doctor’s full name.').max(80),
  specialty: z.string().min(1),
  qualification: z.string().trim().min(2, 'Add a qualification.').max(120),
  location: z.string().trim().min(3, 'Add a clinic name.').max(150),
  fee: z.number().min(0, 'Fee cannot be negative.').max(2000, 'Maximum demo fee is $2,000.'),
  experience: z.number().int().min(0).max(60),
  bio: z.string().trim().min(20, 'Add an introduction of at least 20 characters.').max(1000),
  accepting: z.boolean(),
})
type DoctorForm = z.infer<typeof doctorFormSchema>

function DoctorEditor({ doctor, onComplete }: { doctor?: Doctor; onComplete: () => void }) {
  const { saveDoctor } = useApp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorForm>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: doctor ?? {
      name: '',
      specialty: 'General Physician',
      qualification: '',
      location: '',
      fee: 80,
      experience: 5,
      bio: '',
      accepting: true,
    },
  })
  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => {
        saveDoctor({
          id: doctor?.id ?? `doctor-${crypto.randomUUID()}`,
          image: '',
          color: '#e8f1eb',
          languages: ['English'],
          rating: 0,
          reviews: 0,
          verified: false,
          ...doctor,
          ...values,
        })
        onComplete()
      })}
      noValidate
    >
      <div className={ui.formGrid}>
        <label className={ui.label}>
          <span>Doctor name</span>
          <input
            className={ui.input}
            {...register('name')}
            placeholder="Dr. Alex Morgan"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <small className={ui.error} role="alert">
              {errors.name.message}
            </small>
          )}
        </label>
        <label className={ui.label}>
          <span>Specialty</span>
          <select className={ui.select} {...register('specialty')}>
            {specialties.slice(1).map((specialty) => (
              <option key={specialty}>{specialty}</option>
            ))}
          </select>
        </label>
        <label className={ui.label}>
          <span>Qualification</span>
          <input
            className={ui.input}
            {...register('qualification')}
            placeholder="MD · Internal Medicine"
          />
          {errors.qualification && (
            <small className={ui.error} role="alert">
              {errors.qualification.message}
            </small>
          )}
        </label>
        <label className={ui.label}>
          <span>Clinic</span>
          <input
            className={ui.input}
            {...register('location')}
            placeholder="Careline Medical Center"
          />
          {errors.location && (
            <small className={ui.error} role="alert">
              {errors.location.message}
            </small>
          )}
        </label>
        <label className={ui.label}>
          <span>Consultation fee ($)</span>
          <input
            className={ui.input}
            {...register('fee', { valueAsNumber: true })}
            type="number"
            min={0}
            max={2000}
          />
          {errors.fee && (
            <small className={ui.error} role="alert">
              {errors.fee.message}
            </small>
          )}
        </label>
        <label className={ui.label}>
          <span>Years of experience</span>
          <input
            className={ui.input}
            {...register('experience', { valueAsNumber: true })}
            type="number"
            min={0}
            max={60}
          />
          {errors.experience && (
            <small className={ui.error} role="alert">
              {errors.experience.message}
            </small>
          )}
        </label>
        <label className={cn(ui.label, 'md:col-span-2')}>
          <span>About the doctor</span>
          <textarea
            className={ui.textarea}
            {...register('bio')}
            rows={4}
            maxLength={1000}
            placeholder="Introduce the doctor and their approach to care..."
          />
          {errors.bio && (
            <small className={ui.error} role="alert">
              {errors.bio.message}
            </small>
          )}
        </label>
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          {...register('accepting')}
          className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
        />
        Accepting new appointments
      </label>
      <div className={ui.formActions}>
        <span className="text-sm text-slate-500">Changes apply to this UI demo only.</span>
        <Button type="submit">
          <Check size={16} />
          {doctor ? 'Save profile' : 'Add doctor'}
        </Button>
      </div>
    </form>
  )
}

export default function Management({ mode }: { mode: 'doctors' | 'patients' | 'profile' }) {
  const { state, saveDoctor, toast } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [editor, setEditor] = useState<Doctor | 'new' | null>(null)
  const [patientId, setPatientId] = useState<string | null>(null)
  const ownDoctor = state.doctors.find((doctor) => doctor.id === DOCTOR_ID)!
  const visits = state.appointments.filter(
    (appointment) => state.role === 'admin' || appointment.doctorId === DOCTOR_ID,
  )
  const patients = [
    ...new Map(
      visits.map((appointment) => [
        appointment.patientId,
        { id: appointment.patientId, name: appointment.patientName },
      ]),
    ).values(),
  ].filter((patient) => patient.name.toLowerCase().includes(query.toLowerCase()))
  const filteredDoctors = state.doctors.filter(
    (doctor) =>
      `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'all' ||
        (filter === 'pending' ? !doctor.verified : doctor.verified && doctor.accepting)),
  )
  const selectedPatient = visits.find((appointment) => appointment.patientId === patientId)
  if (mode === 'profile')
    return (
      <div className={ui.page}>
        <PageHeading
          title="Care starts with a connection."
          description="Help patients get to know you and keep your practice details up to date."
        />
        <div className={cn(ui.panel, 'space-y-6 p-5 md:p-6')}>
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
            <Avatar name={ownDoctor.name} src={ownDoctor.image} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{ownDoctor.name}</h2>
              <p className="text-sm text-slate-500">{ownDoctor.specialty}</p>
            </div>
            <Badge>
              <ShieldCheck size={12} />
              Verified specialist
            </Badge>
          </div>
          <DoctorEditor doctor={ownDoctor} onComplete={() => {}} />
        </div>
      </div>
    )
  const exportPatients = () => {
    downloadText(
      'careline-demo-patients.csv',
      [
        'Patient ID,Name,Appointments',
        ...patients.map((patient) =>
          [
            patient.id,
            patient.name,
            String(visits.filter((item) => item.patientId === patient.id).length),
          ]
            .map(csvCell)
            .join(','),
        ),
      ].join('\r\n'),
      'text/csv;charset=utf-8',
    )
    toast('Demo patient list exported.')
  }
  return (
    <div className={ui.page}>
      <PageHeading
        title={
          mode === 'doctors'
            ? 'The people behind better care.'
            : 'People at the heart of your care.'
        }
        description={
          mode === 'doctors'
            ? 'Manage doctor profiles, review verifications, and keep your care network ready.'
            : 'A thoughtful overview of your patient community.'
        }
      >
        {mode === 'doctors' ? (
          <Button onClick={() => setEditor('new')}>
            <Plus size={17} />
            Add doctor
          </Button>
        ) : (
          <Button variant="secondary" onClick={exportPatients}>
            <Download size={17} />
            Export list
          </Button>
        )}
      </PageHeading>
      <section className={cn(ui.panel, 'overflow-hidden')}>
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_auto]">
          <div className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={18} className="text-slate-400" />
            <input
              aria-label={mode === 'doctors' ? 'Search managed doctors' : 'Search patients'}
              placeholder={
                mode === 'doctors'
                  ? 'Search doctors or specialties...'
                  : 'Search by patient name...'
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {mode === 'doctors' && (
            <select
              className={ui.select}
              aria-label="Doctor status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All doctors</option>
              <option value="active">Active doctors</option>
              <option value="pending">Pending verification</option>
            </select>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={ui.table}>
            <thead>
              <tr>
                <th>{mode === 'doctors' ? 'Doctor' : 'Patient'}</th>
                <th>{mode === 'doctors' ? 'Experience' : 'Appointments'}</th>
                <th>{mode === 'doctors' ? 'Visit fee' : 'Latest visit'}</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mode === 'doctors'
                ? filteredDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={doctor.name} src={doctor.image} />
                          <div>
                            <strong className="block text-sm text-slate-900">{doctor.name}</strong>
                            <small>{doctor.specialty}</small>
                          </div>
                        </div>
                      </td>
                      <td>{doctor.experience} years</td>
                      <td>${doctor.fee}</td>
                      <td>
                        <Badge
                          tone={!doctor.verified ? 'orange' : doctor.accepting ? 'green' : 'gray'}
                        >
                          {!doctor.verified
                            ? 'Pending verification'
                            : doctor.accepting
                              ? 'Active'
                              : 'Bookings paused'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={ui.iconButton}
                            aria-label={`Edit ${doctor.name}`}
                            onClick={() => setEditor(doctor)}
                          >
                            <Pencil size={16} />
                          </button>
                          {!doctor.verified ? (
                            <Button
                              variant="secondary"
                              className="min-h-9 px-3"
                              onClick={() => saveDoctor({ ...doctor, verified: true })}
                            >
                              <ShieldCheck size={14} />
                              Verify
                            </Button>
                          ) : (
                            <button
                              className={ui.link}
                              onClick={() =>
                                saveDoctor({ ...doctor, accepting: !doctor.accepting })
                              }
                            >
                              {doctor.accepting ? 'Pause bookings' : 'Enable bookings'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                : patients.map((patient) => {
                    const appointments = visits.filter((item) => item.patientId === patient.id)
                    const lastVisit = [...appointments]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .find((item) => item.status === 'Completed')
                    return (
                      <tr key={patient.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={patient.name} />
                            <div>
                              <strong className="block text-sm text-slate-900">
                                {patient.name}
                              </strong>
                              <small>{patient.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>{appointments.length} visits</td>
                        <td>{lastVisit ? formatDate(lastVisit.date) : 'First visit upcoming'}</td>
                        <td>
                          <Badge tone="blue">Demo patient</Badge>
                        </td>
                        <td>
                          <button className={ui.link} onClick={() => setPatientId(patient.id)}>
                            View patient
                          </button>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
        {(mode === 'doctors' ? !filteredDoctors.length : !patients.length) && (
          <div className="p-4">
            <EmptyState
              icon={mode === 'doctors' ? Stethoscope : Users}
              title="No matches found"
              description="Try another name or reset the filters."
            >
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
              >
                Clear filters
              </Button>
            </EmptyState>
          </div>
        )}
        <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          {mode === 'doctors' ? filteredDoctors.length : patients.length}{' '}
          {mode === 'doctors' ? 'doctor profiles' : 'patients'} · Fictional demo data
        </div>
      </section>
      {editor && (
        <Modal
          title={editor === 'new' ? 'Welcome a doctor to your care team' : 'Edit doctor profile'}
          wide
          onClose={() => setEditor(null)}
        >
          <DoctorEditor
            doctor={editor === 'new' ? undefined : editor}
            onComplete={() => setEditor(null)}
          />
        </Modal>
      )}
      {selectedPatient && (
        <Modal title="Patient overview" onClose={() => setPatientId(null)}>
          <div className="flex items-center gap-3">
            <Avatar name={selectedPatient.patientName} size="lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{selectedPatient.patientName}</h3>
              <p className="text-sm text-slate-500">{selectedPatient.patientId}</p>
            </div>
            <Badge tone="blue">Demo patient</Badge>
          </div>
          <h3 className={ui.subheading}>Visit history</h3>
          <div className="grid gap-3">
            {visits
              .filter((item) => item.patientId === selectedPatient.patientId)
              .map((item) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  to={`/appointments?detail=${item.id}`}
                  key={item.id}
                >
                  <div>
                    <strong className="text-sm text-slate-900">{item.reason}</strong>
                    <small className="block text-slate-500">
                      {formatDate(item.date)} ·{' '}
                      {state.doctors.find((doctor) => doctor.id === item.doctorId)?.name}
                    </small>
                  </div>
                  <Badge tone={item.status === 'Cancelled' ? 'gray' : 'green'}>{item.status}</Badge>
                </Link>
              ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
