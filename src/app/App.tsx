import { Button } from '@/shared/ui/button'
import { QueryProvider } from './providers/query-provider'

function App() {
  return (
    <QueryProvider>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">TaskFlow</h1>
        <Button>Кнопка работает!</Button>
      </div>
    </QueryProvider>
  )
}

export default App
