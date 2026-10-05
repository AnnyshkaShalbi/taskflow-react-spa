import { RouterProvider } from 'react-router'
import { QueryProvider } from './providers/query-provider'
import { router } from './routing/router'

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}

export default App
