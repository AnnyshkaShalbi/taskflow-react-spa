import { pointerWithin, type CollisionDetection, type UniqueIdentifier } from '@dnd-kit/core'
import type { TaskStatus } from '@/entities/task'

/** Табы — тоже цели для drop. Их id отличаем от id колонок префиксом */
export const TAB_DROPPABLE_PREFIX = 'tab:'
export const tabDroppableId = (status: TaskStatus) => `${TAB_DROPPABLE_PREFIX}${status}`
export const isTabDroppable = (id: UniqueIdentifier) => String(id).startsWith(TAB_DROPPABLE_PREFIX)

/**
 * Табы приоритетнее колонок: панель табов sticky и при скролле лежит поверх колонок.
 *
 * dnd-kit замеряет rect'ы droppable заранее и пересчитывает их с поправкой на скролл —
 * для sticky-элементов это даёт неверные координаты. Поэтому табы проверяем по «живому»
 * getBoundingClientRect (он в тех же viewport-координатах, что и pointerCoordinates).
 * Скрытые табы (display: none на xl+) имеют нулевой размер и не участвуют.
 */
export const kanbanCollisionDetection: CollisionDetection = (args) => {
  const { pointerCoordinates, droppableContainers } = args

  if (pointerCoordinates) {
    for (const container of droppableContainers) {
      if (!isTabDroppable(container.id)) continue

      const rect = container.node.current?.getBoundingClientRect()
      if (!rect || rect.width === 0) continue

      const { x, y } = pointerCoordinates
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return [{ id: container.id, data: { droppableContainer: container, value: 0 } }]
      }
    }
  }

  // Табы не задеты — обычная логика: колонка под пальцем/курсором
  return pointerWithin({
    ...args,
    droppableContainers: droppableContainers.filter((c) => !isTabDroppable(c.id)),
  })
}
