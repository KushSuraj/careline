import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import '@fontsource-variable/inter'
import './styles/index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toast } from './components/Toast'
import { store } from './store/store'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
          <Toast />
        </Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
