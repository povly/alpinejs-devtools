# Архитектура: Structured Modules (Technical Layer)

## Обзор

Лёгкая модульная архитектура, адаптированная к фронтенд-реальности браузерного расширения: код организован в доменные модули состояния с техническими подпапками и мягкими границами. Выбрана потому, что существующая структура `packages/browser-extension/src/` уже практически ей соответствует — документ описывает фактическое устройство и задаёт правила зависимостей, не требуя рефакторинга.

Расширение состоит из трёх runtime-контекстов (devtools-панель, content script, background service worker), которые НЕ импортируют код друг друга, а общаются через chrome.runtime messaging.

## Обоснование выбора

- **Тип проекта:** браузерное расширение (Chrome/Firefox MV3), UI-инструмент отладки — без сервера, БД и CRUD-сущностей
- **Стек:** TypeScript + SolidJS + Tailwind CSS v4, pnpm-монорепозиторий (один пакет)
- **Ключевой фактор:** команда 1–5 человек, низкая доменная сложность, но уже сложившееся доменное разделение состояния (`state/components`, `state/stores`, `state/inspector`, `state/messages`, `state/theme`…) — вертикальные слайсы и DDD-контексты избыточны, «плоская» Layered — уже пройденный этап

## Структура папок

```text
packages/browser-extension/
├── src/
│   ├── devtools/                    # КОНТЕКСТ: devtools-панель (SolidJS)
│   │   ├── panel.tsx                #   точка входа панели
│   │   ├── App.tsx                  #   корневой компонент
│   │   ├── components/              #   UI-компоненты (только отображение + обработчики)
│   │   ├── state/                   #   ДОМЕННЫЕ МОДУЛИ СОСТОЯНИЯ (сигналы, вне компонентов)
│   │   │   ├── components.ts        #     домен: список/выбор Alpine-компонентов
│   │   │   ├── stores.ts            #     домен: Alpine stores
│   │   │   ├── inspector.ts         #     домен: инспекция/редактирование данных
│   │   │   ├── message-history.ts   #     домен: история сообщений (time travel)
│   │   │   ├── messages.ts          #     домен: обработка входящих сообщений
│   │   │   └── theme.ts, version.ts, errors.ts …
│   │   ├── messaging.ts, ports.ts   #   адаптеры связи с background (chrome.runtime)
│   │   ├── metrics.ts, inspect.ts   #   сервисные подсистемы панели
│   │   └── types.ts, theme.ts, styles.css
│   ├── scripts/                     # КОНТЕКСТ: скрипты расширения
│   │   ├── content.ts               #   content script (инъекция, связь со страницей)
│   │   ├── detector.ts              #   детектор Alpine-компонентов на странице
│   │   ├── background.ts            #   background service worker (MV3)
│   │   └── proxy.ts, devtools-background.ts
│   ├── lib/                         # ИНФРАСТРУКТУРА: общие утилиты (debounce, prefix, constants)
│   └── mocks/ + mock-chrome-api.ts  # тестовые дубли Chrome API (msw) — только для тестов/симулятора
├── tests/                           # Playwright E2E (v2/, v3/ — версии Alpine)
├── simulator.html                   # симулятор (фейлит Chrome API для разработки и E2E)
├── build.js                         # esbuild: генерация manifest.json и скриптов
└── vite.config.ts                   # сборка панели
```

## Правила зависимостей

- ✅ `components/` → `state/`: компоненты импортируют сигналы напрямую из доменных модулей
- ✅ `state/` → `lib/`: домены состояния используют общие утилиты
- ✅ `components/` → `lib/`: чистые утилиты без состояния
- ✅ `scripts/*` → `lib/`: скрипты расширения используют общие утилиты
- ✅ `state/` → `messaging.ts` / `ports.ts`: домены подписываются/отправляют сообщения через адаптеры
- ❌ `state/` → `components/`: состояние НИКОГДА не импортирует UI
- ❌ `lib/` → `state/`, `lib/` → `components/`: инфраструктурные утилиты не знают о верхних слоях
- ❌ `devtools/` ↔ `scripts/`: контексты расширения не импортируют код друг друга — только chrome.runtime messaging (panel ↔ background ↔ content)
- ❌ Прямые вызовы `chrome.*` из `components/`: браузерное API — только через `messaging.ts`/`ports.ts` (это же граница для моков)
- ❌ `src/` → `mocks/`: моки не утекают в продакшн-код; их потребляет только симулятор/тесты

## Коммуникация между слоями и контекстами

- **Внутри панели:** компоненты читают сигналы доменов напрямую (импорт модуля); побочные эффекты — через экспортируемые доменом функции-действия (пример: `setTheme` в `state/theme.ts` пишет в `localStorage`)
- **Между контекстами расширения:** devtools-панель ↔ background ↔ content через порты и сообщения (`ports.ts`, `messaging.ts`, `chrome.runtime`); входящие сообщения диспетчеризуются в `state/messages.ts`
- **Со страницей:** `content.ts` инъекцирует детектор (`detector.ts`) в MAIN world, находит Alpine-компоненты и пересылает снимки состояния по цепочке в панель

## Ключевые принципы

1. **Сигналы вне компонентов.** `createSignal`/`createEffect` объявляются на уровне модуля в `state/*`; компонент — только рендер и вызов действий домена. Сигналы не передаются props'ами.
2. **Один домен — один файл состояния.** Новая функциональность панели получает свой модуль в `state/`, а не расширяет чужой.
3. **Граница доверия на `chrome.*`.** Всё браузерное API изолировано в `messaging.ts`/`ports.ts`/`scripts/*` — это позволяет симулятору и мокам (`mock-chrome-api.ts`) подменять среду целиком.
4. **Инфраструктура минимальна.** `lib/` содержит только переиспользуемые чистые функции; всё, что относится к панели, живёт в `devtools/`, к расширению — в `scripts/`.
5. **MV3-ограничения.** В панелях запрещён unsafe eval — никакого Alpine/динамического кодогенерации в панели; фоновый контекст — service worker (без persistent-состояния в глобалах дольше сессии).

## Политика организации кода

- **Новые фичи:** следуют этой архитектуре — новый домен состояния в `state/`, UI в `components/`, связь через адаптеры.
- **Существующий код:** структура документирована как есть (легаси-JS файлы `utils.js`, `backend.js`, `sa.js` остаются до отдельного решения). При правках предпочтительны конвенции этого документа, но переписывать нерелевантный код не нужно.
- **Интероперабельность:** при вызове легаси-кода из нового — изолировать обращение, не тащить легаси-паттерны в новые модули.

## Примеры кода

### Домен состояния: сигнал объявлен вне компонента (state/theme.ts)

```ts
import { createEffect, createSignal } from 'solid-js';

type Theme = 'light' | 'dark' | 'system';

// ✅ Сигнал на уровне модуля — единый источник правды
const [theme, _setTheme] = createSignal<Theme>(getInitialTheme());

// Побочный эффект инкапсулирован в действии домена
const setTheme = (newTheme: Theme) => {
  _setTheme(newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
};
```

### Компонент импортирует сигналы напрямую (components/theme-toggle.tsx)

```tsx
import { Component, Show } from 'solid-js';
import { theme, setTheme } from '../state/theme'; // ✅ напрямую, без props

export const ThemeToggle: Component = () => {
  const cycleTheme = () => setTheme(getNextTheme(theme()));
  return (
    <button onClick={cycleTheme} data-tooltip={`Theme: ${theme()}`}>
      <Show when={theme() === 'light'}>{/* иконка */}</Show>
    </button>
  );
};
```

### ❌ Нарушение границы (не делать)

```ts
// ❌ state/stores.ts импортирует UI — циклическая зависимость
import { StoreGrid } from '../components/store-grid';

// ❌ компонент дергает chrome.* напрямую в обход messaging
const [tab] = await chrome.tabs.query({ active: true });
```

## Анти-паттерны

- ❌ `createSignal` внутри тела компонента для разделяемого состояния (локальный UI-state допустим только для действительно локальных вещей)
- ❌ Передача сигналов/сеттеров каскадом через props вместо прямого импорта модуля состояния
- ❌ Бизнес-логика домена в `components/` — компонент тонкий: рендер + вызов действия
- ❌ Импорт `src/devtools` из `src/scripts` (или наоборот) — только chrome.runtime messaging
- ❌ Обращение к `chrome.*` из компонентов в обход `messaging.ts`/`ports.ts`
- ❌ Циклические импорты между доменами `state/*` — общее выносится в `lib/` или новый домен
- ❌ Моки/симуляторные хаки в продакшн-коде (`src/` → `mocks/`)
