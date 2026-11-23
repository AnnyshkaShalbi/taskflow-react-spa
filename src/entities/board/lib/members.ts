import type { Board } from '../model/types'

/** Все участники доски: владелец + приглашённые (владелец — первым) */
export const getBoardMemberIds = (board: Board): string[] => [board.ownerId, ...board.memberIds]
