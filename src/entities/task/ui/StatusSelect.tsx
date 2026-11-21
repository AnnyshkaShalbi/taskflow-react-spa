import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useUpdateTask } from '../api/use-update-task'
import type { Task, TaskStatus } from '../model/types'
import { TASK_STATUSES, taskStatusLabels } from '../model/status'

type StatusSelectProps = {
  task: Task
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
      <SelectTrigger className="h-8 w-35 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TASK_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {taskStatusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}