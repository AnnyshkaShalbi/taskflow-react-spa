import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

export function useKanbanSensors() {
  return useSensors(
    // Мышь: drag начинается после сдвига на 8px, чтобы клик не считался перетаскиванием
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    // Тач: drag только по долгому нажатию, иначе свайп пальцем — это обычный скролл
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  )
}
