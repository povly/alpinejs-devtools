# Alpine.js Devtools

The main application to work on is in `packages/browser-extension`. This is a Chrome/Firefox extension using Manifest v3. The panel is built with SolidJS.

We want to support Safari in the future.

## Coding style

You **MUST** leave signals outside of components.
Components **SHOULD** import signals directly, rather than receiving them as props.

## Styling

This project uses Tailwind CSS v4. You can find the configuration in `tailwind.config.js`.

We also use `basecoat-ui` for some base styles. You can find more information about it here: https://basecoatui.com/kitchen-sink/, based on possible elements you should look at the code on their individual documentation page eg. for Badge, use https://basecoatui.com/components/badge/ and so on.

## Required plan steps

As the last step of any plan, you **MUST** run the following checks and ensure they pass

- `pnpm run format` (run formatter)
- `pnpm run typecheck`
- `pnpm t` (unit tests)

When making changes to the UI, you **SHOULD** propose to run the Playwright tests (see next section).

## Commit message

You **MUST** include the full user-provided prompt as part of commit messages.

## Running Playwright Tests

To run the Playwright E2E tests for the `browser-extension` package, run from the root of the project:

```bash
pnpm pw:run
```

This will start the dev server automatically and run all tests in headless mode.

---

## Обзор проекта

DevTools-расширение для отладки Alpine.js-приложений (Chrome/Firefox, Manifest v3). Монорепозиторий pnpm; основное приложение — `packages/browser-extension`; панель на SolidJS. Полная спецификация: `.ai-factory/DESCRIPTION.md`.

## Технологический стек

- **Язык:** TypeScript (typecheck: `tsgo --noEmit`)
- **UI-фреймворк:** SolidJS
- **Стилизация:** Tailwind CSS v4 + basecoat-css (basecoat-ui)
- **Сборка:** Vite + esbuild; **менеджер:** pnpm workspaces
- **Тесты:** node:test (unit, колокированные) + Playwright (E2E, симулятор)
- **База данных / ORM:** нет (браузерное расширение)

## Структура проекта

```
alpinejs-devtools/                   # pnpm-монорепозиторий
├── packages/
│   └── browser-extension/           # ОСНОВНОЕ ПРИЛОЖЕНИЕ — расширение MV3
│       ├── src/
│       │   ├── devtools/            # панель DevTools (SolidJS)
│       │   │   ├── panel.tsx        #   точка входа панели
│       │   │   ├── App.tsx          #   корневой компонент
│       │   │   ├── components/      #   SolidJS-компоненты
│       │   │   └── state/           #   сигналы и состояние (ВНЕ компонентов!)
│       │   ├── lib/                 # общие утилиты
│       │   ├── scripts/             # content/background/proxy/detector
│       │   └── mocks/               # моки Chrome API (msw)
│       ├── tests/                   # Playwright E2E (v2/, v3/ — версии Alpine)
│       ├── manifest.json            # генерируется build.js (не редактировать вручную)
│       ├── build.js                 # esbuild-сборка manifest и скриптов
│       ├── vite.config.ts           # сборка панели
│       └── tailwind.config.js       # Tailwind v4, палитра alpine-*
├── docs/                            # скриншоты для README
├── .ai-factory/                     # контекст AI Factory (описание, правила, планы)
├── .opencode/skills/                # навыки opencode (aif*, basecoat-ui)
├── .agents/skills/                  # внешние навыки (skills.sh)
└── .github/workflows/build.yml      # CI
```

## Ключевые точки входа

| Файл | Назначение |
|------|-----------|
| `packages/browser-extension/src/devtools/panel.tsx` | Точка входа devtools-панели |
| `packages/browser-extension/src/devtools/App.tsx` | Корневой компонент панели |
| `packages/browser-extension/src/scripts/content.ts` | Content script — инъецируется в страницу |
| `packages/browser-extension/src/scripts/detector.ts` | Детектор Alpine-компонентов на странице |
| `packages/browser-extension/src/scripts/background.ts` | Background service worker (MV3) |
| `packages/browser-extension/manifest.json` | Манифест расширения (генерируется `build.js`) |
| `packages/browser-extension/simulator.html` | Симулятор для разработки и E2E (`/simulator`) |
| `package.json` (корень) | Скрипты: `start`, `build`, `t`, `pw:run`, `format`, `typecheck` |

## Документация

| Документ | Путь | Описание |
|----------|------|----------|
| README | `README.md` | Обзор, установка, магазины расширений |
| FEATURES | `FEATURES.md` | Список функций расширения |
| README пакета | `packages/browser-extension/README.md` | Скрипты пакета browser-extension |
| AGENTS пакета | `packages/browser-extension/AGENTS.md` | Документация уровня каталога пакета |

## AI-контекст файлы

| Файл | Назначение |
|------|-----------|
| `AGENTS.md` | Этот файл — карта проекта и обязательные правила |
| `.ai-factory/DESCRIPTION.md` | Спецификация проекта (стек, функции, требования) |
| `.ai-factory/ARCHITECTURE.md` | Архитектурные правила (создаётся `/aif-architecture`) |
| `.ai-factory/rules/base.md` | Автоопределённые конвенции кодовой базы |
| `.ai-factory/config.yaml` | Конфигурация AI Factory (язык: ru; git: master) |

## Правила для агентов

- Разлагайте shell-команды на последовательные шаги, не объединяйте переключение ветки с pull в одну команду.
  - Неправильно: `git checkout master && git pull`
  - Правильно: сначала `git checkout master`, затем `git pull origin master`
- Подробные конвенции кода (именованием, тесты, импорты, SolidJS-реактивность) — `.ai-factory/rules/base.md`.
