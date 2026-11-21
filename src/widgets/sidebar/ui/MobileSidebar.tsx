import { useState } from 'react'
import { ListTodo, Menu } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'
import { SidebarContent } from './Sidebar'

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-1"
            aria-label="Открыть меню"
          />
        }
      >
        <Menu />
      </SheetTrigger>

      <SheetContent side="left" className="data-[side=left]:w-[min(18rem,85vw)] gap-0 p-0">
        <SheetTitle className="sr-only">Навигация</SheetTitle>

        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4 font-semibold">
          <ListTodo className="h-5 w-5" />
          <span>TaskFlow</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <SidebarContent onNavigate={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
