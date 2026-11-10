import { create } from 'zustand'

type BoardStore = {
  activeBoardId: string
  setActiveBoardId: (id: string) => void
}

const STORAGE_KEY = 'taskflow-active-board'

export const useBoardStore = create<BoardStore>((set) => ({
  activeBoardId: localStorage.getItem(STORAGE_KEY) || 'board-1',

  setActiveBoardId: (id) => {
    localStorage.setItem(STORAGE_KEY, id)
    set({ activeBoardId: id })
  },
}))