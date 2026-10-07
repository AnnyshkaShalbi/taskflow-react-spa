import { taskHandlers } from './handlers/tasks'
import { habitHandlers } from './handlers/habits'

export const handlers = [...taskHandlers, ...habitHandlers]
