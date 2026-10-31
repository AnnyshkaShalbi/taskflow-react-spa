import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

export function useKanbanSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Чтобы клик по карточке не считался перетаскиванием, нужно сдвинуть на 8 пикселей
      },
    }),
    useSensor(KeyboardSensor),
  )
}