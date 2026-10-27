# Установка и интеграция basecoat-css

Источник: https://basecoatui.com/installation/ (v1.1.0; в проекте — 0.3.2).

## NPM-подключение (как в этом проекте)

```css
@import "tailwindcss";
@import "basecoat-css";            /* дефолтный бандл (стиль vega) */
/* или именованный стиль: @import "basecoat-css/maia"; */
```

**Порядок важен:** Basecoat грузится ПОСЛЕ Tailwind (preflight). Полный Tailwind-билд после Basecoat
может сбросить границы/инпуты.

Гранулярные импорты (экономия размера):

```css
@import "tailwindcss";
@import "basecoat-css/base.css";                    /* токены + утилиты, без стайлпака */
@import "basecoat-css/components/button.css";       /* CSS конкретного компонента */
@import "basecoat-css/styles/vega.css";             /* стайлпак */
```

Стайлпаки: `vega`, `nova`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`.

## JS-импорты для интерактивных компонентов

```ts
import "basecoat-css/all";                          // всё, кроме chart
// или поштучно:
import "basecoat-css/basecoat";                     // рантайм (один раз)
import "basecoat-css/dropdown-menu";
import "basecoat-css/select";
```

Доступные JS-импорты: `basecoat-css/all`, `basecoat-css/basecoat`, `chart`, `combobox`, `command`,
`drawer`, `dropdown-menu`, `popover`, `range`, `select`, `sidebar`, `tabs`, `toast`.

**Компонентам нужен JS:** Accordion, Combobox, Command, Drawer, Dropdown Menu, Popover, Select,
Sidebar, Slider, Tabs, Toast (+ Chart через отдельный хелпер, Chart.js отдельно).

В SolidJS-панели этого проекта JS-контроллеры обычно НЕ нужны — состояние управляется сигналами
Solid (см. пример в SKILL.md). Атрибуты/ARIA-контракты Basecoat при этом сохраняются.

## JavaScript lifecycle

- `window.basecoat.initAll()` — инициализация после ручной вставки HTML с компонентами Basecoat
  (идемпотентно; уже инициализированные пропускаются)
- `window.basecoat.initAll({ force: true }) — переинициализация (сбрасывает открытое меню/focus)`

SolidJS рендерит DOM реактивно — при динамической вставке Basecoat-JS-компонентов вызывайте
`initAll()` в `onMount`/после `insert`.

## Совместимость pre-1.0

Проект на 0.3.2. Если встречается легаси-код с классовыми алиасами (`btn-outline`,
`badge-secondary` — полные имена классов вместо data-атрибутов) — это pre-1.0 API. При апгрейде
на 1.x подключается `@import "basecoat-css/compat";` после основного импорта.

## CDN (не используется в проекте, справочно)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/basecoat-css@1.1.0/dist/basecoat.cdn.min.css" />
<script src="https://cdn.jsdelivr.net/npm/basecoat-css@1.1.0/dist/js/all.min.js" defer></script>
```

CDN-стайлшит содержит только утилиты Basecoat; для `bg-primary`/`text-muted-foreground` нужен
Tailwind Play CDN с маппингом `@theme inline { --color-primary: var(--primary); … }`.
