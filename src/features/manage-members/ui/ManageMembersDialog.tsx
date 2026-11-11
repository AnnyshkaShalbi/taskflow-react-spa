import { useState } from 'react'
import { Settings2, Search } from 'lucide-react'
import { useInviteMember, useRemoveMember } from '@/entities/board'
import type { Board } from '@/entities/board'
import { useUsers } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
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
  const [search, setSearch] = useState('')
  const { data: allUsers = [] } = useUsers()
  const { mutate: invite } = useInviteMember()
  const { mutate: remove } = useRemoveMember()

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  const nonOwnerFiltered = filteredUsers.filter(u => u.id !== board.ownerId)
  const isAllSelected = nonOwnerFiltered.length > 0 && 
    nonOwnerFiltered.every(u => board.memberIds.includes(u.id))

  const handleToggleMember = (userId: string, email: string, isCurrentlyMember: boolean) => {
    if (userId === board.ownerId) return
    if (isCurrentlyMember) {
      remove({ boardId: board.id, userId })
    } else {
      invite({ boardId: board.id, email })
    }
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      nonOwnerFiltered.forEach(u => {
        if (board.memberIds.includes(u.id)) {
          remove({ boardId: board.id, userId: u.id })
        }
      })
    } else {
      nonOwnerFiltered.forEach(u => {
        if (!board.memberIds.includes(u.id)) {
          invite({ boardId: board.id, email: u.email })
        }
      })
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

        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по имени или email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between px-2 py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                disabled={nonOwnerFiltered.length === 0}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer select-none">
                Выбрать всех {search && '(найденных)'}
              </label>
            </div>
            <span className="text-xs text-muted-foreground">
              Выбрано: {board.memberIds.length + 1}
            </span>
          </div>

          <div className="max-h-75 overflow-y-auto pr-2 space-y-1">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
              </div>
            ) : (
              filteredUsers.map(user => {
                const isOwner = user.id === board.ownerId
                const isMember = board.memberIds.includes(user.id)
                const isChecked = isOwner || isMember

                return (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleToggleMember(user.id, user.email, isMember)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={isOwner ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.name} {isOwner && <span className="text-xs text-muted-foreground font-normal">(Владелец)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <Checkbox 
                      checked={isChecked}
                      disabled={isOwner}
                      onCheckedChange={() => {}}
                    />
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}