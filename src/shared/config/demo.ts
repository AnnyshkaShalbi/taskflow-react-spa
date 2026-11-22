/**
 * Демо-режим: у проекта нет бэкенда, API имитирует MSW.
 * В dev-режиме демо включено всегда, в production — флагом VITE_DEMO_MODE=true.
 * В демо-режиме запускаются моки и на странице входа показываются демо-аккаунты.
 *
 * __DEMO_MODE__ — константа времени сборки (vite.config.ts → define): без демо-режима
 * на её месте литерал false, и код под этим условием вырезается из бандла.
 */
export const IS_DEMO_MODE = __DEMO_MODE__

export type DemoAccount = {
  email: string
  password: string
  name: string
  /** Чем этот пользователь интересен — подсказка, что попробовать под ним */
  description: string
}

/**
 * Единственный источник демо-аккаунтов: отсюда берут данные и MSW (проверка пароля),
 * и страница входа (быстрый вход). Описания соответствуют стартовым данным моков.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = __DEMO_MODE__ ? [
  {
    email: 'anna@taskflow.dev',
    password: 'password123',
    name: 'Анна Шалбуз',
    description: 'Владелец досок · управляет участниками',
  },
  {
    email: 'ivan@taskflow.dev',
    password: 'password123',
    name: 'Иван Петров',
    description: 'Своя доска + участник чужих',
  },
  {
    email: 'maria@taskflow.dev',
    password: 'password123',
    name: 'Мария Сидорова',
    description: 'Только участник · без прав управления',
  },
] : []
