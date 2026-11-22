/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'true' — демо-сборка: MSW в production и демо-аккаунты на странице входа */
  readonly VITE_DEMO_MODE?: string
}

/** Демо-режим, вычисляется в vite.config.ts (define). Использовать через IS_DEMO_MODE */
declare const __DEMO_MODE__: boolean

interface ImportMeta {
  readonly env: ImportMetaEnv
}
