import { Users } from 'lucide-react'
import { useBoardStore, useBoards } from '@/entities/board'
import { useAuthStore, useUsers } from '@/entities/user'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { ManageMembersDialog } from '@/features/manage-members' // <-- Импорт

const getInitials = (name: string) => 
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export function BoardMembers() {
  const activeBoardId = useBoardStore((s) => s.activeBoardId)
  const { data: boards = [] } = useBoards()
  const { data: allUsers = [] } = useUsers()
  const currentUser = useAuthStore((s) => s.user) // <-- Достаем текущего юзера

  const activeBoard = boards.find((b) => b.id === activeBoardId)

  if (!activeBoard) return null

  const isOwner = activeBoard.ownerId === currentUser?.id
  const memberIds = [activeBoard.ownerId, ...activeBoard.memberIds]
  
  const members = memberIds
    .map(id => allUsers.find(u => u.id === id))
    .filter((u): u is NonNullable<typeof u> => !!u)

  return (
    <div className="flex items-center gap-3 bg-muted/30 w-fit px-3 py-1.5 rounded-full border">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>Участники:</span>
      </div>
      
      <div className="flex -space-x-2">
        {members.map(member => (
          <Avatar key={member.id} className="h-6 w-6 border-2 border-background shadow-sm hover:z-10 transition-transform hover:-translate-y-1">
            <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* Кнопка управления (только для владельца) */}
      {isOwner && (
        <div className="ml-1 pl-2 border-l border-muted-foreground/20">
          <ManageMembersDialog board={activeBoard} />
        </div>
      )}
    </div>
  )
}