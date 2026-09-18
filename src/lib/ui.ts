export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export const ui = {
  page: 'space-y-6',
  panel: 'rounded-xl border border-slate-200 bg-white shadow-sm',
  card: 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
  muted: 'text-sm leading-6 text-slate-500',
  heading: 'text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl',
  subheading: 'text-lg font-semibold text-slate-900',
  input:
    'min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
  textarea:
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
  select:
    'min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
  label: 'grid gap-2 text-sm font-medium text-slate-700',
  error: 'text-xs font-medium text-red-600',
  formGrid: 'grid gap-4 md:grid-cols-2',
  formActions: 'mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
  iconButton:
    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500',
  link: 'inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900',
  table:
    'w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm text-slate-600 [&_td]:border-t [&_td]:border-slate-100 [&_td]:px-4 [&_td]:py-4 [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-slate-500',
}
