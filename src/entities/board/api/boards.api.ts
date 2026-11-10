import { http } from '@/shared/api/http'
import type { Board, CreateBoardInput } from '../model/types'

export const boardsApi = {
  getAll: (token: string): Promise<Board[]> => {
    return http<Board[]>('/boards', { token })
  },
  create: (input: CreateBoardInput, token: string): Promise<Board> => {
    return http<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(input),
      token,
    })
  },
  delete: (id: string, token: string): Promise<void> => {
    return http<void>(`/boards/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}