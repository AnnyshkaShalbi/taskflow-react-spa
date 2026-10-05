# TaskFlow

SPA-трекер задач и привычек для удалённых команд. Канбан-доска, повторяющиеся привычки, графики прогресса и шаринг досок — всё на клиенте с имитацией API через MSW.

## ✨ Возможности

- 📋 Канбан-доска с drag-and-drop
- 🔁 Трекер повторяющихся привычек
- 📊 Графики прогресса
- 👥 Шаринг досок с коллегами
- 🔐 Авторизация (имитация через MSW)
- 🌗 Светлая и тёмная темы

## 🛠 Стек

**Core:**
- React 19 + TypeScript 7
- Vite 8
- React Router 7 (Data Router)

**State:**
- TanStack Query 5 — серверный стейт
- Zustand 5 — клиентский стейт

**Forms & Validation:**
- React Hook Form + Zod 4

**UI:**
- Tailwind CSS 4
- shadcn/ui (Base UI + Nova preset)
- Lucide React

**Tooling:**
- ESLint 10 (flat config) + Prettier
- TypeScript strict mode

**Mocking:**
- MSW (Mock Service Worker) — планируется

**Testing:**
- Vitest + Testing Library — планируется

## 🏗 Архитектура

Проект построен по методологии **[Feature-Sliced Design](https://feature-sliced.design/)**.

```
src/
  app/        # точка входа, провайдеры, роутер, глобальные стили
  pages/      # страницы под маршруты
  widgets/    # самостоятельные UI-блоки (Header, KanbanBoard)
  features/   # пользовательские сценарии (create-task, toggle-habit)
  entities/   # бизнес-сущности (task, habit, user, board)
  shared/     # переиспользуемое: ui, lib, api, config, types
  mocks/      # MSW-хендлеры
```

**Правило импортов:** слой может импортировать только из слоёв ниже себя. Внутри слоя — только через `index.ts` (public API).

## 🚀 Запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

**Сборка:**
```bash
npm run build
npm run preview
```

**Качество кода:**
```bash
npm run lint
npm run format
```

## 🗺 Roadmap

- [x] Инициализация проекта (Vite + React + TS)
- [x] Настройка Tailwind CSS 4
- [x] FSD-структура проекта
- [x] Алиасы путей (`@/*`)
- [x] shadcn/ui (Base UI + Nova)
- [x] Настройка TanStack Query (QueryClientProvider)
- [x] Базовый роутинг
- [ ] Layout + Header + Sidebar
- [ ] Страница Login (react-hook-form + Zod)
- [ ] Авторизация через Zustand + MSW
- [ ] CRUD задач
- [ ] Канбан-доска с drag-and-drop
- [ ] Трекер привычек
- [ ] Графики прогресса
- [ ] Шаринг досок
- [ ] Тёмная тема
- [ ] Тесты (Vitest + RTL)
- [ ] CI (GitHub Actions)

## 📝 Лицензия

MIT