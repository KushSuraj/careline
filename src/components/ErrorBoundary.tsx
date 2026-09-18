import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Careline UI error', error, info.componentStack)
  }
  render() {
    if (this.state.failed)
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center text-slate-700">
          <AlertCircle size={36} />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Let’s try that again.</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Something interrupted this page. Your saved demo data is still on this device.
          </p>
          <button
            className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      )
    return this.props.children
  }
}
