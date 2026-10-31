// Возвращает сегодняшнюю дату в формате "YYYY-MM-DD" (в локальном часовом поясе)
export function getTodayString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Считает текущий стрик (сколько дней подряд выполнено, включая сегодня или вчера)
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  // Сортируем даты по убыванию (от новых к старым)
  const sortedDates = [...completedDates].sort().reverse()
  
  const today = new Date()
  const todayStr = getTodayString()
  
  // Вчерашняя дата
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  // Если нет ни сегодня, ни вчера — стрик сброшен
  if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
    return 0
  }

  let streak = 0
  // Используем const и создаем копию объекта Date через new Date()
  const currentDate = new Date(sortedDates.includes(todayStr) ? today : yesterday)

  // Идем назад по дням и считаем непрерывную цепочку
  while (true) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    
    if (completedDates.includes(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Возвращает массив из 7 объектов с датами за последнюю неделю
export function getLast7Days(): { dateStr: string; label: string }[] {
  const days = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    // Красивая метка для оси X (например, "12 окт")
    const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    
    days.push({ dateStr, label })
  }
  return days
}