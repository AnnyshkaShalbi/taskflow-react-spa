import type { Board } from '@/entities/board'

export const mockBoards: Board[] = [
  {
    id: 'board-1',
    title: 'Работа',
    description: 'Задачи по текущему проекту и рабочему процессу',
    ownerId: 'user-1',
    memberIds: ['user-2', 'user-3'],
    isPublic: false,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-10-06T15:30:00.000Z',
  },
  {
    id: 'board-2',
    title: 'Личное',
    description: 'Домашние дела, покупки, личные проекты',
    ownerId: 'user-1',
    memberIds: [],
    isPublic: false,
    createdAt: '2026-09-15T18:00:00.000Z',
    updatedAt: '2026-10-04T20:00:00.000Z',
  },
  {
    id: 'board-3',
    title: 'Обучение',
    description: 'Курсы, книги, статьи — всё, что читаю',
    ownerId: 'user-2',
    memberIds: ['user-1'],
    isPublic: true,
    createdAt: '2026-09-20T07:00:00.000Z',
    updatedAt: '2026-10-02T11:00:00.000Z',
  },
  {
    id: 'board-4',
    title: 'Публичный roadmap',
    description: 'Открытая доска для планирования фич TaskFlow',
    ownerId: 'user-1',
    memberIds: ['user-2'],
    isPublic: true,
    createdAt: '2026-09-25T12:00:00.000Z',
    updatedAt: '2026-10-07T08:30:00.000Z',
  },
]
