import { Check, ChevronsUpDown } from 'lucide-react'
import { useBoardStore } from '@/entities/board'
import { useBoards } from '@/entities/board'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

export function BoardSwitcher() {
  const { data: boards = [] } = useBoards()
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const setActiveBoardId = useBoardStore((s) => s.setActiveBoardId)

  const activeBoard = boards.find((b) => b.id === activeBoardId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" className="w-full justify-between" />
      }>
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold truncate">
            {activeBoard?.title || 'Выберите доску'}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="start">
        {/* 2. Оборачиваем всё в DropdownMenuGroup */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Мои доски</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {boards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => setActiveBoardId(board.id)}
              className="cursor-pointer flex justify-between"
            >
              <span>{board.title}</span>
              {board.id === activeBoardId && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}