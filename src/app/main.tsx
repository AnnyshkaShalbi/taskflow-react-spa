import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import App from '@/app/App'

// Бэкенда нет — в демо-режиме (dev или VITE_DEMO_MODE=true) API имитирует MSW, в т.ч. в production
// __DEMO_MODE__ здесь напрямую (а не IS_DEMO_MODE из shared/config): литерал в условии
// позволяет сборщику выкинуть dynamic import и не собирать чанк MSW без демо-режима
async function enableMocking() {
  if (!__DEMO_MODE__) return
  const { worker } = await import('@/mocks/browser')
  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    // В dev предупреждаем о незамоканных запросах, в production — молча пропускаем (шрифты, ассеты)
    onUnhandledRequest: import.meta.env.DEV ? 'warn' : 'bypass',
    quiet: !import.meta.env.DEV,
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
