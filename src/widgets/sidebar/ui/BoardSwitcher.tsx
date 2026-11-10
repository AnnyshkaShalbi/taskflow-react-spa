import { useState } from 'react'
import { Check, ChevronsUpDown, Trash2, Plus } from 'lucide-react'
import { useBoardStore, useBoards, useDeleteBoard } from '@/entities/board'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { CreateBoardDialog } from '@/features/create-board'

export function BoardSwitcher() {
  // 1. Состояние для открытия диалога
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data: boards = [] } = useBoards()
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const setActiveBoardId = useBoardStore((s) => s.setActiveBoardId)
  const { mutate: deleteBoard } = useDeleteBoard()

  const activeBoard = boards.find((b) => b.id === activeBoardId)

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteBoard(id)
    if (id === activeBoardId && boards.length > 1) {
      const nextBoard = boards.find(b => b.id !== id)
      if (nextBoard) setActiveBoardId(nextBoard.id)
    }
  }

  return (
    <>
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Мои доски</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {boards.map((board) => (
              <DropdownMenuItem
                key={board.id}
                onClick={() => setActiveBoardId(board.id)}
                className="cursor-pointer flex justify-between group"
              >
                <div className="flex items-center gap-2">
                  {board.id === activeBoardId && <Check className="h-4 w-4" />}
                  <span>{board.title}</span>
                </div>
                
                {boards.length > 1 && (
                  <AlertDialog>
                    <AlertDialogTrigger render={
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }>
                      <Trash2 className="h-3.5 w-3.5" />
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить доску?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Все задачи внутри этой доски будут безвозвратно удалены.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel render={<Button variant="outline" />}>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                          render={<Button variant="destructive" />}
                          onClick={(e) => handleDelete(board.id, e)}
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer text-primary font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Создать доску
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  )
}