import { RouterProvider } from 'react-router'
import { QueryProvider } from './providers/query-provider'
import { router } from './routing/router'
import { useThemeEffect } from '@/features/theme-toggle'

export function App() {
  useThemeEffect()

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}

export default App
