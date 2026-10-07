import { taskHandlers } from './handlers/tasks'
import { habitHandlers } from './handlers/habits'
import { boardHandlers } from './handlers/boards'

export const handlers = [...taskHandlers, ...habitHandlers, ...boardHandlers]
