# Шпаргалка компонентов basecoat-ui

Источник: https://basecoatui.com/components/ (v1.1.0). Markdown-версии: `/components/<name>.md`.

## Button — https://basecoatui.com/components/button/

Корневой класс `btn` на `<button>` (действие) или `<a>` (навигация).

- Варианты (`data-variant`): `(без атрибута)` primary · `secondary` · `outline` · `ghost` · `link` · `destructive`
- Размеры (`data-size`): `xs` · `sm` · `(умолч.)` · `lg` · `icon-xs` · `icon-sm` · `icon` · `icon-lg`
- Иконочные кнопки: `data-size="icon*"` + `aria-label`
- Инлайн-иконки в текстовой кнопке: `data-icon="inline-start|inline-end"` на `<svg>`
- Спиннер: `<svg class="animate-spin …" data-icon="inline-start">` + `disabled`

```html
<button type="button" class="btn">Primary</button>
<button type="button" class="btn" data-variant="outline" data-size="sm">Small outline</button>
<button type="button" class="btn" data-variant="ghost" data-size="icon" aria-label="Settings">…svg…</button>
```

Группировка — компонент Button Group: `<div role="group" class="button-group">…</div>`.

## Badge — https://basecoatui.com/components/badge/

`class="badge"` на инлайн-элементе (`<span>`, `<a>`).

- Варианты: `(умолч.)` · `secondary` · `destructive` · `outline` · `ghost`
- Иконки: `data-icon="inline-start|inline-end"`; спиннер: `class="animate-spin"` + `role="status"`
- Кастомные цвета — обычные Tailwind-утилиты поверх: `class="badge bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"`

```html
<span class="badge">Default</span>
<span class="badge" data-variant="secondary">Secondary</span>
```

## Card — https://basecoatui.com/components/card/

```html
<div class="card">
  <header>
    <h2>Заголовок</h2>
    <p>Описание</p>
    <div class="card-action"><!-- действие/метаданные в правом верхнем углу --></div>
  </header>
  <section>Основной контент</section>
  <footer>Футер</footer>
</div>
```

- `data-size="sm"` — плотная вёрстка
- Картинка: `<img>` ПЕРЕД `<header>`
- `<menu class="card-action">` — если card-action это список команд

## Input / Label / Field — https://basecoatui.com/components/input/

```html
<input class="input" type="email" placeholder="Email" />
<label class="label" for="x">Email</label>

<div role="group" class="field">
  <label for="x">Email</label>
  <input id="x" type="email" />
  <p>Подсказка/описание</p>
</div>
```

- Инпуты внутри `class="field"` стилизуются автоматически (текстовые типы)
- Состояния нативные: `disabled`, `required`, `aria-invalid="true"` (инвалид-стиль)
- `type="file"` поддерживается
- Иконка внутри инпута (Input Group): `class="input ps-9"` + absolute-обёртка для svg

## Tooltip — https://basecoatui.com/components/tooltip/

CSS-only, только текст (одна строка, обрезается с ellipsis — отличается от shadcn/ui).

- `data-tooltip="текст"` на любом элементе
- `data-side`: `top` (умолч.) · `bottom` · `left` · `right` · `inline-start` · `inline-end`
- `data-align`: `start` · `center` (умолч.) · `end`
- Disabled-кнопка не ховерится — оборачивайте: `<span class="inline-block" data-tooltip="…"><button disabled>…</button></span>`

```html
<button class="btn" data-variant="outline" data-tooltip="Подсказка" data-side="bottom">Hover</button>
```

(В проекте используется в `theme-toggle.tsx`.)

## Tabs — https://basecoatui.com/components/tabs/

```html
<div class="tabs" id="t">
  <nav role="tablist" aria-orientation="horizontal">
    <button type="button" role="tab" id="t-tab-1" aria-controls="t-panel-1" aria-selected="true" tabindex="0">Первый</button>
    <button type="button" role="tab" id="t-tab-2" aria-controls="t-panel-2" aria-selected="false" tabindex="-1">Второй</button>
  </nav>
  <div role="tabpanel" id="t-panel-1" aria-labelledby="t-tab-1" tabindex="-1">…</div>
  <div role="tabpanel" id="t-panel-2" aria-labelledby="t-tab-2" tabindex="-1" hidden>…</div>
</div>
```

- `aria-orientation="vertical"` на tablist — вертикальные табы; `data-variant="line"` — линейный стиль
- Активный таб: `aria-selected="true"` + `tabindex="0"`; неактивные: `tabindex="-1"`, панели `hidden`
- Disabled: `disabled` или `aria-disabled="true"`
- JS-контроллер (если нужен): `import "basecoat-css/tabs"`; API: `tabs.select(btn)`, `tabs.refresh()`

## Dropdown Menu — https://basecoatui.com/components/dropdown-menu/

Позиционирование inline относительно враппера (без портала, как в shadcn/ui).

```html
<div class="dropdown-menu">
  <button type="button" aria-haspopup="menu" aria-controls="m" aria-expanded="false" class="btn" data-variant="outline">Открыть</button>
  <div data-popover aria-hidden="true" data-align="end" class="min-w-32">
    <div role="menu" id="m">
      <div role="menuitem"><span>Profile</span><kbd>⇧⌘P</kbd></div>
      <div role="menuitem" data-variant="destructive">Delete</div>
      <hr role="separator" />
      <div role="menuitemcheckbox" aria-checked="true"><span data-indicator>✓svg</span>Status Bar</div>
      <div role="menuitemradio" aria-checked="false"><span data-indicator>✓svg</span>Top</div>
    </div>
  </div>
</div>
```

- Группы: `<div role="group" aria-labelledby="{ID}">` + `<div role="heading" id="{ID}">`
- Позиция: `data-side="top|right|bottom|left|inline-start|inline-end"`, `data-align="start|center|end"`
- `data-indicator` — иконка галочки для checkbox/radio пунктов; `aria-disabled="true"` — disabled пункт
- JS: `import "basecoat-css/dropdown-menu"`; API: `dropdown.open()`, `close()`, `toggle()`, `refresh()`

## Прочие компоненты (индекс)

| Компонент | Корневой класс / паттерн | URL |
|---|---|---|
| Accordion | `accordion` (JS) | /components/accordion/ |
| Alert | `alert` + `data-variant` | /components/alert/ |
| Alert Dialog | `alert-dialog` (JS) | /components/alert-dialog/ |
| Avatar | `avatar` | /components/avatar/ |
| Breadcrumb | `breadcrumb` | /components/breadcrumb/ |
| Button Group | `button-group` | /components/button-group/ |
| Chart (beta) | хелпер `basecoat-css/chart` + Chart.js | /components/chart/ |
| Checkbox | `checkbox` | /components/checkbox/ |
| Combobox | `combobox` (JS) | /components/combobox/ |
| Command | `command` (JS) | /components/command/ |
| Dialog | `dialog` (JS) | /components/dialog/ |
| Drawer (beta) | `drawer` (JS) | /components/drawer/ |
| Empty | `empty` | /components/empty/ |
| Input Group | паттерн иконок в инпуте | /components/input-group/ |
| Item | `item` | /components/item/ |
| Kbd | `kbd` | /components/kbd/ |
| Native Select | `select` (нативный) | /components/native-select/ |
| Pagination | `pagination` | /components/pagination/ |
| Popover | `popover` (JS) | /components/popover/ |
| Progress | `progress` | /components/progress/ |
| Radio Group | `radio-group` | /components/radio-group/ |
| Scroll Area | `scroll-area` | /components/scroll-area/ |
| Separator | `hr[role="separator"]` | /components/separator/ |
| Sidebar | `sidebar` (JS) | /components/sidebar/ |
| Skeleton | `skeleton` | /components/skeleton/ |
| Slider | JS `basecoat-css/range` | /components/slider/ |
| Spinner | `spinner` | /components/spinner/ |
| Switch | `switch` | /components/switch/ |
| Table | `table` | /components/table/ |
| Textarea | `textarea` | /components/textarea/ |
| Theme Switcher | виджет | /components/theme-switcher/ |
| Toast | `toast` (JS) | /components/toast/ |

Точный HTML каждого компонента берите с его страницы (или её `.md`-версии) — не выдумывайте API.
