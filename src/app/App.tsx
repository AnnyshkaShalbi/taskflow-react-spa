import { RouterProvider } from 'react-router'
import { QueryProvider } from './providers/query-provider'
import { AuthInitializer } from './providers/auth-initializer'
import { router } from './routing/router'
import { useThemeEffect } from '@/features/theme-toggle'

export function App() {
  useThemeEffect()

  return (
    <QueryProvider>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryProvider>
  )
}

export default App