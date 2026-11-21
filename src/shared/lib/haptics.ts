/**
 * Лёгкий тактильный отклик (вибрация) на тач-устройствах.
 * Vibration API есть в Android-браузерах; iOS Safari его не поддерживает — там вызов просто ничего не делает.
 */
export function hapticTap(durationMs = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(durationMs)
  }
}

/** true, если событие пришло от касания пальцем (а не мыши/клавиатуры) */
export function isTouchEvent(event: Event | null | undefined): boolean {
  return typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
}
