import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { dismissToast, selectToast } from '../store/appSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function Toast() {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(selectToast)

  useEffect(() => {
    if (!toast.message) return
    const timeout = window.setTimeout(() => dispatch(dismissToast(toast.id)), 5000)
    return () => window.clearTimeout(timeout)
  }, [dispatch, toast.id, toast.message])

  if (!toast.message) return null

  return (
    <div
      className="fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-xl"
      role="status"
    >
      <CheckCircle2 size={19} />
      <span>{toast.message}</span>
      <button
        className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Dismiss notification"
        onClick={() => dispatch(dismissToast(undefined))}
      >
        <X size={17} />
      </button>
    </div>
  )
}
