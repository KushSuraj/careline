import { useDeferredValue, useState } from 'react'
import { Heart, Search, SlidersHorizontal, Stethoscope, X } from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { useSearchParams } from 'react-router'
import { useApp } from '../context/app-context'
import { Button, DoctorCard, EmptyState, PageHeading } from '../components/ui'
import { specialties } from '../data/mock-data'

export default function Doctors({ savedOnly = false }: { savedOnly?: boolean }) {
  const { state } = useApp()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const specialty = params.get('specialty') ?? 'All specialties'
  const [sort, setSort] = useState('recommended')
  const [availableOnly, setAvailableOnly] = useState(false)
  const feeLimit = Math.max(200, ...state.doctors.map((doctor) => Math.ceil(doctor.fee / 25) * 25))
  const [maxFee, setMaxFee] = useState(feeLimit)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const search = useDeferredValue(query).toLowerCase().trim()
  const filtered = state.doctors
    .filter(
      (doctor) =>
        doctor.verified &&
        (!savedOnly || state.favorites.includes(doctor.id)) &&
        (specialty === 'All specialties' || doctor.specialty === specialty) &&
        (!availableOnly || doctor.accepting) &&
        doctor.fee <= maxFee &&
        `${doctor.name} ${doctor.specialty} ${doctor.location} ${doctor.languages.join(' ')}`
          .toLowerCase()
          .includes(search),
    )
    .sort((a, b) =>
      sort === 'price-low'
        ? a.fee - b.fee
        : sort === 'experience'
          ? b.experience - a.experience
          : b.rating - a.rating || b.reviews - a.reviews,
    )
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const reset = () => {
    setParams({})
    setAvailableOnly(false)
    setMaxFee(feeLimit)
    setSort('recommended')
  }

  return (
    <div className={ui.page}>
      <PageHeading
        eyebrow={savedOnly ? 'YOUR CARE TEAM' : 'CARE THAT FEELS RIGHT'}
        title={savedOnly ? 'Your trusted doctors' : 'Find your right care.'}
        description={
          savedOnly
            ? 'The people you trust, always a little closer.'
            : 'Experienced specialists, thoughtful care, and available appointment times.'
        }
      />
      <section className="grid gap-4 rounded-2xl border border-teal-100 bg-teal-700 p-6 text-white md:grid-cols-[auto_1fr_auto] md:items-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
          {savedOnly ? <Heart size={28} /> : <Stethoscope size={28} />}
        </span>
        <div>
          <h2 className="text-xl font-semibold">
            {savedOnly ? 'Great care starts with a connection.' : 'A specialist for every step.'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-teal-50">
            {savedOnly
              ? 'Save a doctor by tapping the heart on their profile.'
              : 'Explore verified care professionals and find a time that works for you.'}
          </p>
        </div>
        <span className="hidden text-5xl font-light text-white/25 md:block">+</span>
      </section>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex min-h-12 flex-1 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 shadow-sm">
          <Search size={19} className="text-slate-400" />
          <input
            aria-label="Search doctors"
            placeholder="Search by doctor, specialty, or clinic..."
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
            className="w-full rounded-sm bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              className={ui.iconButton}
              aria-label="Clear search"
              onClick={() => updateParam('q', '')}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          variant="secondary"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={17} />
          Filters
          {(availableOnly || maxFee < feeLimit) && (
            <span className="h-2 w-2 rounded-full bg-teal-600" />
          )}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pb-1" aria-label="Filter by specialty">
        {specialties.map((item) => (
          <button
            key={item}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
              specialty === item
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50',
            )}
            aria-pressed={specialty === item}
            onClick={() => updateParam('specialty', item === 'All specialties' ? '' : item)}
          >
            {item}
          </button>
        ))}
      </div>
      {filtersOpen && (
        <div
          className={cn(
            ui.card,
            'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
          )}
        >
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            Accepting appointments only
          </label>
          <label className="grid gap-2 text-sm text-slate-600 md:min-w-72">
            <span>
              Maximum visit fee: <strong className="text-slate-900">${maxFee}</strong>
            </span>
            <input
              aria-label="Maximum visit fee"
              type="range"
              min="0"
              max={feeLimit}
              step="5"
              value={maxFee}
              onChange={(event) => setMaxFee(Number(event.target.value))}
              className="accent-teal-700"
            />
          </label>
          <button className={ui.link} onClick={reset}>
            Reset filters
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-slate-500">
          <strong className="text-slate-900">{filtered.length} doctors</strong>{' '}
          {savedOnly ? 'in your saved list' : 'ready to care for you'}
        </p>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          Sort by
          <select
            aria-label="Sort doctors"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className={ui.select}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="experience">Most experienced</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={savedOnly ? Heart : Search}
          title={savedOnly ? 'Make room for your care team' : 'No doctors match these filters'}
          description={
            savedOnly
              ? 'Explore our doctors and tap the heart to save your favorites.'
              : 'Try a different name, specialty, or visit fee.'
          }
        >
          <Button onClick={reset} variant="secondary">
            Clear filters
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
