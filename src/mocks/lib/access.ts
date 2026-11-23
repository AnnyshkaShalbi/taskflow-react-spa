import { getBoardMemberIds, type Board } from '@/entities/board'
import { db } from '../db'

/**
 * Правила доступа мок-сервера — одно место вместо проверок, разбросанных по обработчикам.
 * Модель простая: владелец доски управляет участниками и доской, все участники работают с задачами.
 */
export const isBoardMember = (board: Board, userId: string) =>
  getBoardMemberIds(board).includes(userId)

export const isBoardOwner = (board: Board, userId: string) => board.ownerId === userId

export const findBoard = (boardId: string) => db.boards.getAll().find((b) => b.id === boardId)

/** id досок, к которым у пользователя есть доступ */
export const getAccessibleBoardIds = (userId: string) =>
  new Set(
    db.boards
      .getAll()
      .filter((b) => isBoardMember(b, userId))
      .map((b) => b.id),
  )
