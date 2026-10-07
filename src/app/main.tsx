import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import App from '@/app/App'

async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'warn' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
