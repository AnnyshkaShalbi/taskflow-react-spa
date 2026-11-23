import type { Task } from '@/entities/task'

const getDate = (daysAgo: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

// Дата без времени со сдвигом от сегодня (для сроков): +2 → через два дня
const getDay = (offset: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Настроить MSW',
    description: 'Подключить мок-сервер для имитации API',
    status: 'in-progress',
    priority: 'high',
    boardId: 'board-1',
    assigneeId: 'user-1',
    dueDate: getDay(2),
    tags: ['setup'],
    createdAt: getDate(6),
    updatedAt: getDate(0),
  },
  {
    id: 'task-2',
    title: 'Сверстать канбан-доску',
    description: [
      'Три колонки: Todo / In Progress / Done, drag-and-drop через @dnd-kit.',
      '',
      'Требования:',
      '— карточки перетаскиваются между колонками, статус сохраняется на сервере;',
      '— оптимистичное обновление: карточка переезжает сразу, при ошибке — откат;',
      '— на мобилке колонки идут горизонтальной лентой со scroll-snap;',
      '— на тач-устройствах drag начинается по долгому нажатию, свайп — это скролл;',
      '— альтернатива drag-and-drop: меню «Переместить в…» на карточке;',
      '— табы с количеством задач над лентой, на них можно бросить карточку.',
      '',
      'Доступность:',
      '— карточку можно взять с клавиатуры (Space), стрелки — перемещение;',
      '— у колонок понятные подписи для скринридеров.',
      '',
      'Критерии готовности: работает на мобилке, планшете и десктопе, нет мигания при переключении колонок, анимации плавные.',
    ].join('\n'),
    status: 'todo',
    priority: 'high',
    boardId: 'board-1',
    assigneeId: 'user-2',
    dueDate: getDay(5),
    tags: ['frontend', 'ui'],
    createdAt: getDate(5),
    updatedAt: getDate(5),
  },
  {
    id: 'task-3',
    title: 'Написать тесты для стора',
    description: 'Покрыть Zustand-стор авторизации базовыми сценариями',
    status: 'todo',
    priority: 'medium',
    boardId: 'board-1',
    assigneeId: 'user-3',
    dueDate: getDay(-1),
    tags: ['testing'],
    createdAt: getDate(4),
    updatedAt: getDate(4),
  },
  {
    id: 'task-4',
    title: 'Починить тёмную тему',
    description: 'При перезагрузке страницы тема сбрасывается на светлую',
    status: 'done', 
    priority: 'medium',
    boardId: 'board-1',
    assigneeId: 'user-1',
    tags: ['bug', 'ui'],
    createdAt: getDate(3),
    updatedAt: getDate(1), 
  },
  {
    id: 'task-5',
    title: 'Обновить README',
    description: 'Добавить раздел с архитектурой проекта',
    status: 'done',
    priority: 'low',
    boardId: 'board-1',
    tags: ['docs'],
    createdAt: getDate(2),
    updatedAt: getDate(0), 
  },
  {
    id: 'task-6',
    title: 'Изучить TanStack Query',
    description: 'Оптимистичные апдейты, инвалидация кэша, useMutation',
    status: 'done',
    priority: 'medium',
    boardId: 'board-2',
    assigneeId: 'user-1',
    tags: ['learning'],
    createdAt: getDate(1),
    updatedAt: getDate(1),
  },
  {
    id: 'task-7',
    title: 'Купить продукты',
    description: 'Молоко, хлеб, кофе',
    status: 'todo',
    priority: 'low',
    boardId: 'board-2',
    assigneeId: 'user-1',
    dueDate: getDay(1),
    tags: ['personal'],
    createdAt: getDate(0), 
    updatedAt: getDate(0),
  },
]