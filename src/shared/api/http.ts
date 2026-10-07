const API_URL = '/api'

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка запроса' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}
