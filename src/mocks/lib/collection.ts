/**
 * «Таблица» мок-сервера в localStorage: читает сохранённые данные, а если их нет
 * (или они повреждены) — стартовые (seed). Одна реализация вместо копии в каждом обработчике.
 */
export function createCollection<T>(storageKey: string, seed: T[]) {
  return {
    getAll(): T[] {
      const stored = localStorage.getItem(storageKey)
      if (!stored) return structuredClone(seed)
      try {
        return JSON.parse(stored) as T[]
      } catch {
        return structuredClone(seed)
      }
    },

    saveAll(items: T[]) {
      localStorage.setItem(storageKey, JSON.stringify(items))
    },

    /** Вернуть стартовые данные — пригодится в тестах для чистого состояния */
    reset() {
      localStorage.removeItem(storageKey)
    },
  }
}
