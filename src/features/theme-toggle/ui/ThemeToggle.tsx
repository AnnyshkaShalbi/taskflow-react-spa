import { Moon, Sun } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useThemeStore } from '../model/store'

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Переключить тему">
      {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
