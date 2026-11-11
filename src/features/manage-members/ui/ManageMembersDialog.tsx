import { Settings2 } from 'lucide-react'
import { useInviteMember, useRemoveMember } from '@/entities/board'
import type { Board } from '@/entities/board'
import {  useUsers } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/shared/ui/dialog'

const getInitials = (name: string) => 
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export function ManageMembersDialog({ board }: { board: Board }) {
  const { data: allUsers = [] } = useUsers()
  const { mutate: invite } = useInviteMember()
  const { mutate: remove } = useRemoveMember()

  const handleToggleMember = (userId: string, email: string, isCurrentlyMember: boolean) => {
    // Если владелец — ничего не делаем (его нельзя исключить)
    if (userId === board.ownerId) return

    if (isCurrentlyMember) {
      remove({ boardId: board.id, userId })
    } else {
      invite({ boardId: board.id, email })
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border shadow-sm bg-background hover:bg-muted" />
      }>
        <Settings2 className="h-4 w-4" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Управление участниками</DialogTitle>
          <DialogDescription>
            Выберите, кто имеет доступ к доске «{board.title}».
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-2">
          {allUsers.map(user => {
            const isOwner = user.id === board.ownerId
            const isMember = board.memberIds.includes(user.id)
            // Владелец всегда считается участником (чекбокс заблокирован)
            const isChecked = isOwner || isMember

            return (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => handleToggleMember(user.id, user.email, isMember)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={isOwner ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name} {isOwner && <span className="text-xs text-muted-foreground">(Вы)</span>}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <Checkbox 
                  checked={isChecked}
                  disabled={isOwner}
                  // Мы обрабатываем клик на весь ряд, поэтому тут просто отображаем состояние
                  onCheckedChange={() => {}} 
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}