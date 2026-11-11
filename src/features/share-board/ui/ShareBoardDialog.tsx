import { useState, type FormEvent } from 'react' // <-- Исправлен импорт
import { Users, X } from 'lucide-react'
import { useInviteMember, useRemoveMember } from '@/entities/board'
import type { Board } from '@/entities/board'
import { useAuthStore, useUsers } from '@/entities/user'
import { ApiError } from '@/shared/api/http' // <-- Импортируем класс ошибки
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

type ShareBoardDialogProps = {
  board: Board
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export function ShareBoardDialog({ board }: ShareBoardDialogProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  
  const currentUser = useAuthStore(s => s.user)
  const { data: allUsers = [] } = useUsers()
  const { mutate: invite, isPending: isInviting } = useInviteMember()
  const { mutate: remove } = useRemoveMember()

  const isOwner = board.ownerId === currentUser?.id

  const handleInvite = (e: FormEvent) => { // <-- Убрали React.
    e.preventDefault()
    setError('')
    if (!email) return

    invite({ boardId: board.id, email }, {
      onSuccess: () => setEmail(''),
      // Исправление: указываем тип ApiError вместо any
      onError: (err: ApiError) => {
        setError(err.message || 'Ошибка при приглашении')
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" />
      }>
        <Users className="h-4 w-4" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Доступ к доске «{board.title}»</DialogTitle>
          <DialogDescription>
            Пригласите коллег по email. Они получат доступ к задачам на этой доске.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
        <form onSubmit={handleInvite} className="flex gap-2">
            <Input 
            placeholder="colleague@example.com" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={isInviting}>
            {isInviting ? '...' : 'Пригласить'}
            </Button>
        </form>
          
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Участники:</h4>
            
            {(() => {
              const owner = allUsers.find(u => u.id === board.ownerId)
              return (
                <div className="flex items-center justify-between p-2 rounded-md bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {owner ? getInitials(owner.name) : 'В'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{owner?.name || 'Владелец'}</p>
                      <p className="text-xs text-muted-foreground">Владелец</p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {board.memberIds.map(memberId => {
              const member = allUsers.find(u => u.id === memberId)
              if (!member) return null

              return (
                <div key={memberId} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => remove({ boardId: board.id, userId: memberId })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}