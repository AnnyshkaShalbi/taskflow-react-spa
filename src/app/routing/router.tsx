import { createBrowserRouter } from 'react-router'
import { AppLayout } from './AppLayout'
import { DashboardPage } from '@/pages/dashboard'
import { BoardPage } from '@/pages/board'
import { HabitsPage } from '@/pages/habits'
import { SettingsPage } from '@/pages/settings'
import { NotFoundPage } from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'board', element: <BoardPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
