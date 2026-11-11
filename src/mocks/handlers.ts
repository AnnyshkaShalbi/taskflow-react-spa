import { taskHandlers } from './handlers/tasks'
import { habitHandlers } from './handlers/habits'
import { boardHandlers } from './handlers/boards'
import { authHandlers } from './handlers/auth'
import { userHandlers } from './handlers/users'


export const handlers = [...taskHandlers, ...habitHandlers, ...boardHandlers, ...authHandlers, ...userHandlers]
