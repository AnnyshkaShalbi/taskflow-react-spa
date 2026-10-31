import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useUpdateTask } from '../api/use-update-task'
import type { Task, TaskStatus } from '../model/types'

type StatusSelectProps = {
  task: Task
}

const statusLabels: Record<TaskStatus, string> = {
  'todo': 'К выполнению',
  'in-progress': 'В работе',
  'done': 'Готово',
}

export function StatusSelect({ task }: StatusSelectProps) {
  const { mutate, isPending } = useUpdateTask()

  const handleStatusChange = (newStatus: TaskStatus | null) => {
    if (!newStatus) return 
    mutate({
        id: task.id,
        input: { status: newStatus },
    })
  }

  return (
    <Select
      defaultValue={task.status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
          <SelectItem key={status} value={status}>
            {statusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}