import { taskHandlers } from './handlers/tasks'
import { habitHandlers } from './handlers/habits'
import { boardHandlers } from './handlers/boards'
import { authHandlers } from './handlers/auth'
import { userHandlers } from './handlers/users'
import { commentHandlers } from './handlers/comments'


export const handlers = [...taskHandlers, ...habitHandlers, ...boardHandlers, ...authHandlers, ...userHandlers, ...commentHandlers]
