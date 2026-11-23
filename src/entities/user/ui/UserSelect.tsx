import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { getInitials } from '@/shared/lib/get-initials'
import { cn } from 'cn'
import type { User } from '../model/types'

// Base UI Select не умеет null в value для «пустого» пункта — используем служебное значение
const NONE = '__none__'

type UserSelectProps = {
  /** Из кого выбирать (например, участники доски) */
  users: User[]
  value?: string
  onChange: (userId: string | undefined) => void
  /** Подпись пустого варианта */
  noneLabel?: string
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

export function UserSelect({
  users,
  value,
  onChange,
  noneLabel = 'Не назначен',
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
}: UserSelectProps) {
  // items — карта value → подпись: по ней SelectValue показывает имя, а не id
  const items = {
    [NONE]: noneLabel,
    ...Object.fromEntries(users.map((u) => [u.id, u.name])),
  }

  return (
    <Select
      items={items}
      value={value ?? NONE}
      onValueChange={(next) => onChange(next && next !== NONE ? next : undefined)}
      disabled={disabled}
    >
      {/* На таче 40px — как поле даты рядом и остальные поля ввода */}
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn('w-full pointer-coarse:data-[size=default]:h-10', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>
          <span className="text-muted-foreground">{noneLabel}</span>
        </SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{user.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
