import { createBrowserRouter } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from './AppLayout'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { BoardPage } from '@/pages/board'
import { HabitsPage } from '@/pages/habits'
import { SettingsPage } from '@/pages/settings'
import { NotFoundPage } from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />, 
    children: [
      {
        element: <AppLayout />,  
        children: [
          { path: '/', index: true, element: <DashboardPage /> },
          { path: 'board', element: <BoardPage /> },
          { path: 'habits', element: <HabitsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])