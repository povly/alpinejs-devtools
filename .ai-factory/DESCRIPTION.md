# Alpine.js Devtools

## Обзор

DevTools-расширение для браузеров (Chrome/Firefox, Manifest v3) для отладки приложений на Alpine.js. Позволяет инспектировать и редактировать состояние компонентов и stores Alpine прямо в панели DevTools. Монорепозиторий pnpm с единственным основным пакетом `packages/browser-extension`. Панель построена на SolidJS (Alpine.js запрещён в панелях MV3 из-за запрета unsafe eval). В планах — поддержка Safari.

## Основные функции

- Инспекция и редактирование состояния компонентов Alpine
- Просмотр и редактирование состояния stores (Early Access)
- Подсветка компонента на странице при наведении
- Данные компонентов и stores в консольных глобалах
- Таб предупреждений (Warnings), включая поддержку Alpine v3
- Переход к корневому элементу / прокрутка к элементу
- Time travel-дебаггинг `$data` (Early Access)
- Фильтрация компонентов; пиннинг путей данных
- Высокая производительность на вложенных данных (~10k свойств)
- Два релизных канала: mainline (бесплатный) и early-access (платный)

## Технологический стек

- **Язык:** TypeScript (typecheck через `tsgo --noEmit`)
- **UI-фреймворк:** SolidJS (не React/Alpine — из-за MV3-ограничений на eval)
- **Стилизация:** Tailwind CSS v4 + basecoat-css (basecoat-ui)
- **Сборка:** Vite 7 + esbuild (генерация manifest.json через `build.js`), `postbuild.js`
- **Менеджер пакетов:** pnpm workspaces (`packages/*`)
- **Тестирование:** node:test (`--experimental-strip-types`, unit-тесты колокированы рядом с исходниками), Playwright E2E против симулятора (`pnpm pw:run`), msw для моков Chrome API
- **Упаковка:** web-ext (Chrome и Firefox артефакты), Manifest v3
- **Качество кода:** Prettier, husky + lint-staged

## Архитектурные заметки

- Три контура расширения: devtools-панель (SolidJS, `src/devtools/`), content script с детектором Alpine (`src/scripts/content.ts`, `detector.ts`), background service worker (`src/scripts/background.ts`)
- Сигналы объявляются ВНЕ компонентов — на уровне модулей в `src/devtools/state/*`; компоненты импортируют их напрямую
- Состояние панели разделено по доменам: components, stores, inspector, messages, theme, version
- Симулятор (`simulator.html` + `simulator-entry.tsx`) фейлит Chrome/Firefox APIs для разработки и E2E
- Тестовые страницы в корне пакета (`v3.html`, `v2/`, `nested-getters.html` и др.) используются Playwright через `/simulator?target=<page>.html`
- Поддерживаются Alpine v2 и v3

## Архитектура

Подробные архитектурные правила: `.ai-factory/ARCHITECTURE.md`.
**Паттерн:** Structured Modules (Technical Layer) — адаптирован к существующей структуре фронтенд-расширения.

## Нефункциональные требования

- **Производительность:** стабильная работа на глубоко вложенных объектах данных (~10k свойств)
- **Форматирование:** Prettier (`pnpm run format`), pre-commit hook через husky/lint-staged
- **Обязательные проверки при завершении планов:** `pnpm run format`, `pnpm run typecheck`, `pnpm t`
- **E2E при UI-изменениях:** `pnpm pw:run`
- **Лицензия:** MIT
