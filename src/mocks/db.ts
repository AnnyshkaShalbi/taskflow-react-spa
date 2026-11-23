import type { Board } from '@/entities/board'
import type { Comment } from '@/entities/comment'
import type { Habit } from '@/entities/habit'
import type { Task } from '@/entities/task'
import type { User } from '@/entities/user'
import { mockBoards } from './data/boards'
import { mockComments } from './data/comments'
import { mockHabits } from './data/habits'
import { mockTasks } from './data/tasks'
import { mockUsers } from './data/users'
import { createCollection } from './lib/collection'

/** «База данных» мок-сервера: по коллекции на сущность */
export const db = {
  boards: createCollection<Board>('taskflow-mock-boards', mockBoards),
  comments: createCollection<Comment>('taskflow-mock-comments', mockComments),
  habits: createCollection<Habit>('taskflow-mock-habits', mockHabits),
  tasks: createCollection<Task>('taskflow-mock-tasks', mockTasks),
  users: createCollection<User>('taskflow-mock-users', mockUsers),
}

/** Сбросить все данные к стартовым (например, перед каждым тестом) */
export function resetDb() {
  Object.values(db).forEach((collection) => collection.reset())
}
