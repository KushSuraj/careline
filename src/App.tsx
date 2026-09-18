import { RouterProvider } from 'react-router/dom'
import { router } from './router'

export { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return <RouterProvider router={router} />
}
