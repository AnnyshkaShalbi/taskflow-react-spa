import { Button } from '@/shared/ui/button/button'
import { QueryProvider } from './providers/query-provider'

function App() {
  return (
    <QueryProvider>
      <section id="center">
        <div>
          <h1 className="text-3xl font-bold underline">Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        <Button>Кнопка работает!</Button>
      </section>
    </QueryProvider>
  )
}

export default App
