import { useState } from 'react'
import { Download, FileHeart, FileText, HeartPulse, Search, ShieldCheck } from 'lucide-react'
import { cn, ui } from '../lib/ui'
import { useApp } from '../context/app-context'
import { Badge, Button, EmptyState, Modal, PageHeading } from '../components/ui'
import { medicalRecords } from '../data/mock-data'
import { formatDate } from '../lib/dates'
import { downloadText } from '../lib/downloads'

const recordStats = [
  {
    icon: FileHeart,
    value: medicalRecords.length,
    label: 'Medical records',
    tone: 'bg-violet-50 text-violet-700',
  },
  {
    icon: FileText,
    value: medicalRecords.filter((record) => record.type === 'Lab report').length,
    label: 'Lab reports',
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    icon: HeartPulse,
    value: medicalRecords.filter((record) => record.type === 'Visit summary').length,
    label: 'Visit summaries',
    tone: 'bg-teal-50 text-teal-700',
  },
]

export default function Records() {
  const { state, toast } = useApp()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All records')
  const [selected, setSelected] = useState<(typeof medicalRecords)[number] | null>(null)
  const records = medicalRecords.filter(
    (record) =>
      (type === 'All records' || type === record.type) &&
      `${record.title} ${record.doctor}`.toLowerCase().includes(query.toLowerCase()),
  )
  const download = (record: (typeof medicalRecords)[number]) => {
    downloadText(
      `careline-${record.id}-demo.txt`,
      `CARELINE · FICTIONAL DEMO RECORD\n\n${record.title}\nPatient: ${state.profile.name}\nClinician: ${record.doctor}\nDate: ${record.date}\nType: ${record.type}\n\n${record.description}\n\nThis file is sample UI data. It is not a medical document or medical advice.`,
    )
    toast('Sample record downloaded.')
  }
  return (
    <div className={ui.page}>
      <PageHeading
        title="Your health story, together."
        description="Reports, visit summaries, and the details that matter."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {recordStats.map(({ icon: Icon, value, label, tone }) => (
          <div className={cn(ui.card, 'flex items-center gap-4')} key={label}>
            <span className={cn('grid h-12 w-12 place-items-center rounded-xl', tone)}>
              <Icon size={23} />
            </span>
            <span>
              <strong className="block text-2xl text-slate-900">{value}</strong>
              <small className="text-sm text-slate-500">{label}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            aria-label="Search medical records"
            placeholder="Search your records..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          className={ui.select}
          aria-label="Record type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option>All records</option>
          <option>Lab report</option>
          <option>Visit summary</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {records.map((record) => (
          <article className={cn(ui.panel, 'space-y-4 p-5')} key={record.id}>
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-xl',
                  record.type === 'Lab report'
                    ? 'bg-violet-50 text-violet-700'
                    : 'bg-teal-50 text-teal-700',
                )}
              >
                {record.icon === 'heart' ? <HeartPulse size={25} /> : <FileText size={25} />}
              </span>
              <Badge tone={record.type === 'Lab report' ? 'purple' : 'green'}>{record.type}</Badge>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{record.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{record.doctor}</p>
              <small className="text-xs text-slate-400">{formatDate(record.date)}</small>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button className={ui.link} onClick={() => setSelected(record)}>
                View record
              </button>
              <button
                className={ui.iconButton}
                aria-label={`Download ${record.title}`}
                onClick={() => download(record)}
              >
                <Download size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!records.length && (
        <EmptyState title="No matching records" description="Try another search or record type.">
          <Button
            variant="secondary"
            onClick={() => {
              setQuery('')
              setType('All records')
            }}
          >
            Clear filters
          </Button>
        </EmptyState>
      )}
      <div className="flex gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
        <ShieldCheck size={18} />
        <span>
          These are fictional sample records. No real medical data is collected or stored.
        </span>
      </div>
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <Badge tone="purple">SAMPLE RECORD</Badge>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Patient', state.profile.name],
              ['Doctor', selected.doctor],
              ['Date', formatDate(selected.date)],
              ['Record type', selected.type],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <p className={ui.muted}>{selected.description}</p>
          <div className="flex gap-2 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
            <FileHeart size={17} />
            <span>This is demonstration content, not a clinical record.</span>
          </div>
          <Button onClick={() => download(selected)}>
            <Download size={17} />
            Download sample record
          </Button>
        </Modal>
      )}
    </div>
  )
}
