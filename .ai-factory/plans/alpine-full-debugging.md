# План: Полноценный дебаггинг Alpine.js — разблокировка всех функций + окружение страницы + реактивный watch

- **Ветка:** master (план без ветки — `git.create_branches: false`)
- **Дата:** 2026-10-27
- **Режим:** Full
- **Идентификатор плана:** `alpine-full-debugging`

## Original Request

я вот хочу сделать полную поддержку и чтобы в dev консоли все могли смотреть, тоесть какие данные, что в store, какие плагины, или скрипты в текущей странице и прочее! я форк сделал потому что не полноценная и там платнеая штука, вот надо реализовать все функции, просмотры, поизучай что не хватает, и как сеньор разработчик и тестировщик посмотри чего не хватает. В целом должно бюыть все функции, возможности, реактивности и чтобы мог все смотреть, еще и видеть что там внутри него, посмотреть какие данные и при клике и какие-то действия меняются реактивно все, и можем видеть что происходить. Это будет отлично, если реализуем и будет полнценный дебагинг

## Settings

- **Testing:** да — unit (node:test, колокированные `*.test.ts`) + Playwright E2E (`pnpm pw:run`)
- **Logging:** verbose — `console.debug('[alpine-devtools] …')` на путях детекта/диффа/отправки данных; `console.warn` для нештатных ситуаций; шумные логи за `import.meta.env.DEV`
- **Docs:** да — обязательный чекпоинт: обновить `FEATURES.md` (сейчас заглушка-ссылка) и README-заметку форка через `/aif-docs`-паттерн
- **Обязательные проверки плана:** `pnpm run format`, `pnpm run typecheck`, `pnpm t`

## Requirements Reconciliation

Источники (по приоритету): 1) оригинальный запрос пользователя (объём); 2) `README.md` (матрица Free vs Early Access); 3) фактический код (`src/lib/constants.ts`, `src/scripts/backend.js`, гейты `isEarlyAccess`). Конфликтов нет — запрос является надмножеством; код уточняет реализуемость.

Анализ пробелов (senior dev + QA):

| Возможность | Статус в коде | Действие |
|---|---|---|
| Stores view/edit, store globals `$s*` | реализовано, EA-гейт (`store-grid.tsx`) | разблокировать |
| Warnings > FREE_WARNINGS_COUNT | реализовано, лимит | разблокировать |
| Time travel (история 500 снимков, restore) | реализовано, лимит FREE_HISTORY_COUNT | разблокировать |
| Jump-to-root / inspect | реализовано, EA-гейт | разблокировать |
| Пиннинг путей данных | реализовано, EA-гейт (`data-attribute-display.tsx:106`) | разблокировать |
| Лицензия/trial (checkoutpage.co), телеметрия (sa_event/sa_pageview) | активны | удалить (личный форк) |
| Реактивный sync выбранного компонента/store (v3) | уже есть: `Alpine.effect` на каждый rootEl и на stores | не реализовывать заново |
| Подсветка ЧТО изменилось (diff) | нет — пересылается весь снимок | добавить (diff + flash) |
| Журнал изменений (activity feed) | нет | добавить |
| Список плагинов | реестра плагинов в Alpine нет | перечислять `Alpine.directives` + `Alpine.magics` + stores (честная альтернатива) |
| Скрипты страницы | нет | добавить (document.scripts) |
| Ecosystem-инструменты (htmx/turbo/livewire/…) | детект уже есть в backend (`sendAlpineVersion`), уходит только в телеметрию | показать в UI |

Комбинации (Alpine v2 × v3):

| Комбинация | Поддержка | Верификация |
|---|---|---|
| v3 × {components, stores, warnings, history, jump, pin, page-info, watch/diff} | полная | E2E `tests/v3/*` + новые спеки |
| v2 × {components, warnings, history, jump, pin, page-info, watch/diff} | полная (watch через mutation-observer) | E2E `tests/v2/*` + новые спеки |
| v2 × {stores} | НЕ поддерживается бэкендом (`hasAlpineDataFn` — v3 API; `alpineStoreMagic` = `{}`) | вне объёма; документировать ограничение в Page-табе («Stores: requires Alpine v3») |

Реальный артефакт в end-to-end проверке: симулятор `packages/browser-extension/simulator.html` (+ целевые страницы `v2.html`, `v3.html`, `nested-getters.html`) — не синтетические фикстуры.

## Tasks

### Фаза 0 — Разблокировка форка

- [x] **T1. Постоянный доступ ко всем функциям** — `packages/browser-extension/src/lib/isEarlyAccess.ts`: `isEarlyAccess` всегда `true` (упростить модуль, сохранить экспорт-контракт для потребителей), удалить trial/лицензионную механику (`startTrial`, `activateLicense`, `checkoutPageLicenseKeyCheck`, `loadPersistedEarlyAccessInfo`), env-ветку `VITE_MAINLINE_PUBLISH`. Потребители (`store-grid`, `warnings`, `history-flyout`, `component-list-item`, `data-attribute-display`, `footer`) не трогать — их гейты откроются сами. Лог: `console.debug('[alpine-devtools] all features unlocked (fork build)')` при старте панели.
- [x] **T2. Удалить лицензионный UI и внешние вызовы** — удалить `src/devtools/components/activate-license.tsx`, `early-access.tsx`; вычистить использования (`footer.tsx` trial-баннеры/ссылки, `debug-menu.tsx` пункты force-EA, `panel.tsx`); удалить моки checkoutpage в `src/mocks/handlers.ts`; удалить тесты `tests/trial-mode.spec.ts`, `tests/license-activation.spec.ts` (заменяются в T10). Лог: warn при остаточных ссылках на удалённые символы (проверить grep'ом).
- [x] **T3. Вырезать телеметрию** — `src/devtools/metrics.ts`: `metric`/`sampledMetric`/`view` → no-op c `console.debug` в DEV; убрать `window.sa_event`/`sa_pageview`; `toolDetector` и бакеты оставить (переиспользуются в T4); вычистить вызовы `view()` (`App.tsx`, `panel.tsx`). Никаких сетевых вызовов из форка, кроме явных действий пользователя.

### Фаза 1 — Вкладка «Страница»: окружение, directives/magics, скрипты

- [x] **T4. Сбор информации о странице в backend** — `src/scripts/backend.js`: собрать page-info: alpineVersion; `Object.keys(Alpine.directives)`, `Object.keys(Alpine.magics)`; список stores; ecosystem-инструменты (переиспользовать детект из `sendAlpineVersion`: hasHtmxTarget, hasAlpineAjaxTarget, hasPineconeRouter, hasLivewire, hasLiveView, hasTurbo); инвентарь скриптов (`document.scripts`: src | inline, type, async, defer). Новое сообщение `SET_PAGE_INFO` в `src/lib/constants.ts` (BACKEND_TO_PANEL), типы в `src/devtools/types.ts`, новый домен `src/devtools/state/page-info.ts` (сигналы на уровне модуля, по правилам проекта). Лог: debug-лог состава (кол-во directives/magics/скриптов) при отправке.
- [x] **T5. UI вкладки «Страница»** — `TabValues` (`types.ts`) + `header.tsx` + новый `components/page-info.tsx`: секции «Alpine» (версия, directives, magics, stores count; для v2 — пометка «Stores: requires Alpine v3»), «Ecosystem» (badges инструментов), «Scripts» (список с фильтром). Стили — Tailwind + классы basecoat (`badge`, `input`, `btn`); `data-testid` для E2E. Лог: debug при смене данных вкладки.

### Фаза 2 — Реактивный watch: diff, подсветка, журнал

- [x] **T6. Diff в backend** — `src/scripts/backend.js`: в `debouncedSendComponentData`/`debouncedSendStoreData` сравнивать сериализованный снимок с предыдущим (побайтовое сравнение упрощённых JSON-строк по ключам) и добавлять в payload `changedKeys: string[]` (flattened-пути изменившихся полей). Не ломать существующих потребителей (поле опционально). Лог: debug с числом изменившихся ключей + warn при ошибке сравнения.
- [x] **T7. Подсветка изменений в панели** — новый домен `src/devtools/state/reactivity.ts`: хранит последние `changedKeys` + timestamp по цели; `components/data-attribute-display.tsx`: flash-анимация (Tailwind `transition`/keyframe) строки, чей id входит в изменённые; сброс по таймеру. Затрагивает `component-grid.tsx`/`store-grid.tsx` (проброс последнего diff в данные). Лог: debug «N rows highlighted for <target>».
- [x] **T8. Журнал активности** — `src/devtools/state/activity.ts`: кольцевой буфер последних ~100 записей {время, цель (компонент/store), ключи}; UI `components/activity-flyout.tsx` (иконка-кнопка в `header.tsx`, дровер/popover, список). Зависит от T6 (источник данных). Лог: debug при добавлении записи.
- [x] **T9. Бейджи изменений в списках** — СНАЧАЛА ПРОВЕРИТЬ: эффекты в backend ставятся на ВСЕ rootEl (не только выбранные) — если да, данные всех компонентов уже приходят при изменениях, и задача чисто UI: точка-индикатор «недавно изменён» на `component-list-item.tsx`/`store-list-item.tsx` (по данным activity из T8), затухающая по таймеру. Если нет — расширить подписку эффектов на все компоненты (backend). Лог: debug частоты событий.

### Фаза 3 — Регрессия, проверки, документация

- [x] **T10. E2E новых и разблокированных функций** — новые: `tests/unlocked-features.spec.ts` (stores/warnings>лимита/history/pin доступны без лицензии), `tests/page-info.spec.ts` (вкладка «Страница»: версия, directives, скрипты симулятора), `tests/reactive-watch.spec.ts` (клик по кнопке симулятора → появление flash-тестid/записи в activity; v3-страница; для v2 — отдельный кейс через `v2.html`). Прогнать `pnpm pw:run` целиком (регрессия v2/v3).
- [x] **T11. Обязательные проверки + документация** — `pnpm run format` → `pnpm typecheck` → `pnpm t`; обновить `FEATURES.md` (реальная матрица функций форка вместо ссылки) и заметку в `README.md` (форк: все функции открыты, телеметрии нет, ограничения v2).

## Commit Plan

- **Commit 1** (после T1–T3): `feat: unlock all devtools features, remove license checks and telemetry`
- **Commit 2** (после T4–T5): `feat: add Page tab with Alpine directives/magics, ecosystem tools and scripts inventory`
- **Commit 3** (после T6–T9): `feat: reactive change tracking with diff highlighting and activity log`
- **Commit 4** (после T10–T11): `test: coverage for unlocked features and reactive watch; docs refresh`

Каждый коммит: полный пользовательский промпт в теле сообщения (правило AGENTS.md).

## Notes / Риски

- `backend.js` — легаси-JS без типов (`types.ts` прямо говорит «can improve when backend.js is ported to TypeScript»); изменения точечные, без портирования всего файла (вне объёма).
- Дифф на глубоких объектах: сравнение упрощённых JSON — O(size) на каждый debounce; при ~10k свойств контролировать дебаунс (`MSG_DEBOUNCE_MS`), метрики времени в debug-логах.
- Firefox-инъекция backend идёт через `fetch(scriptPath)` + innerHTML (content.ts) — новые файлы не добавляются, риска нет.
- T9 — первая задача с явной проверкой гипотезы перед реализацией (verify-first).
