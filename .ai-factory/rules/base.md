# Базовые правила проекта

> Автоопределённые конвенции из анализа кодовой базы. Редактируйте по мере необходимости.

## Именование

- Файлы: `kebab-case` (`theme.ts`, `activate-license.tsx`); исторические исключения-точки входа: `App.tsx`, `panel.tsx`; легаси-JS: `utils.js`, `backend.js`, `sa.js`
- Переменные и функции: `camelCase`
- Константы уровня модуля: `SCREAMING_SNAKE_CASE` (пример: `THEME_STORAGE_KEY` в `src/devtools/state/theme.ts`)
- Типы: `PascalCase`

## Структура модулей

- `src/devtools/` — панель DevTools (SolidJS): `components/`, `state/`, точка входа `panel.tsx` → `App.tsx`
- `src/devtools/state/` — сигналы и логика состояния; объявляются на уровне модуля (см. раздел SolidJS ниже)
- `src/lib/` — общие утилиты (`debounce.ts`, `prefix.ts`, `constants.ts`)
- `src/scripts/` — content script, background, proxy, detector
- `src/mocks/` + `src/mock-chrome-api.ts` — моки Chrome API (msw)
- `tests/` — Playwright E2E; подпапки `v2/`, `v3/` — версии Alpine

## Обработка ошибок

- `try/catch` используется точечно — только на границах доверия: `localStorage`, Chrome API, инъекция скриптов (`src/lib/isEarlyAccess.ts`, `src/mock-chrome-api.ts`, `src/scripts/content.ts`)
- `throw new Error` — редко (3 случая в `src/`); в основном ошибки логируются, а не бросаются

## Поток управления

- Предпочтительны плоские guard clauses и ранние `return`/`continue` вместо глубокой вложенности (пример: `getInitialTheme` в `src/devtools/state/theme.ts`)

## Логирование

- Прямые вызовы `console.*` без обёрток: `console.warn` (13), `console.log` (19), `console.info` (6), `console.error` (1)
- Для нештатных, но некритичных ситуаций используется `console.warn`

## Тестирование

- Unit: колокированные `*.test.ts` рядом с исходником (`src/lib/prefix.test.ts`); `node:test` + `node:assert/strict`; импорт тестируемого модуля с явным расширением `.ts` (`./prefix.ts`)
- E2E: `tests/*.spec.ts`; Playwright `test()` + `expect`; выборки через `getByTestId`; целевая страница задаётся query-параметром `/simulator?target=<page>.html`
- Команды: `pnpm t` (unit), `pnpm pw:run` (E2E, из корня)

## Импорты

- Относительные пути; алиасы в `tsconfig.json` не настроены — `@/` не используется
- В unit-тестах исходники импортируются с расширением `.ts` (для `node --experimental-strip-types`)

## SolidJS-реактивность (критично)

- Сигналы создаются на уровне модуля в `src/devtools/state/*`, НЕ внутри компонентов
- Компоненты импортируют сигналы напрямую из модуля состояния: `import { theme, setTheme } from '../state/theme'` — сигналы не передаются как props
- Побочные эффекты инкапсулируются в сеттеры-обёртки (`setTheme` пишет в `localStorage`)

## Стилизация

- Tailwind-утилиты инлайн в JSX; кастомная палитра (`alpine-300` и т.п.); произвольные breakpoint'ы вида `min-[961px]:`
- Dark mode через класс `.dark` на `documentElement`
- `basecoat-css` — базовые стили UI-компонентов (документация: basecoatui.com)
