---
name: basecoat-ui
description: >
  Использование basecoat-ui (basecoat-css) — CSS-библиотеки компонентов в стиле shadcn/ui для любого
  стека, построенной на Tailwind CSS. Используйте при работе над UI devtools-панели Alpine.js Devtools:
  кнопки, бейджи, карточки, инпуты, табы, тултипы, dropdown-меню и другие компоненты; классы вида
  btn/badge/card/input, атрибуты data-variant/data-size/data-tooltip. Триггеры: basecoat, basecoat-css,
  basecoatui, 'btn class', data-variant, data-tooltip, стилизация панели devtools.
---

# basecoat-ui (basecoat-css)

Basecoat — CSS-библиотека компонентов «вся магия shadcn/ui, без React»: работает с любым стеком,
стилизуется Tailwind CSS. Компоненты — семантический HTML + корневой класс + `data-*`-атрибуты.
Большинство компонентов чисто CSS; интерактивные требуют JS-контроллера Basecoat.

## Контекст этого проекта

- Зависимость: `basecoat-css` **0.3.2** (`packages/browser-extension/package.json`)
- Подключение: `@import 'tailwindcss'; @import 'basecoat-css';` в `src/devtools/styles.css` (после
  Tailwind — порядок важен: Basecoat грузится ПОСЛЕ preflight Tailwind)
- Панель построена на **SolidJS** — Basecoat framework-agnostic, конфликтов нет
- Уже используется в коде: классы `btn` (debug-menu.tsx), `input` + `label`
  (activate-license.tsx), атрибуты `data-tooltip` / `data-side` (theme-toggle.tsx)
- Tailwind CSS v4 + кастомная палитра проекта (`alpine-*`), dark mode через класс `.dark`

**ВНИМАНИЕ (версии):** документация basecoatui.com описывает **v1.1.0**, проект использует
**0.3.2**. В 1.0 API уменьшен до корневых классов + data-атрибутов; pre-1.0 имёл дополнительные
классовые алиасы (напр. `btn-outline`), для них есть `basecoat-css/compat`. В 0.3.2 атрибуты
`data-variant` / `data-size` / `data-tooltip` уже работают (проект их использует). Если класс или
атрибут из доков v1.1.0 не срабатывает — проверьте фактический CSS установленной версии:
`packages/browser-extension/node_modules/basecoat-css/dist/`.

## Быстрая шпаргалка

| Компонент | Корневой класс | Варианты (data-variant) | JS нужен |
|---|---|---|---|
| Button | `btn` | `primary`(умолч.) `secondary` `outline` `ghost` `link` `destructive` | нет |
| Badge | `badge` | (умолч.) `secondary` `destructive` `outline` `ghost` | нет |
| Card | `card` | `data-size="sm"` | нет |
| Input | `input` | состояния: `disabled`, `aria-invalid="true"` | нет |
| Label | `label` | — | нет |
| Field (группа) | `field` | — | нет |
| Tooltip | `data-tooltip` на триггере | `data-side`/`data-align` | нет (CSS-only, только текст) |
| Tabs | `tabs` | `data-variant="line"` на tablist | да (`basecoat-css/tabs`) |
| Dropdown Menu | `dropdown-menu` | `data-variant="destructive"` на menuitem | да (`basecoat-css/dropdown-menu`) |
| Separator | `hr[role="separator"]` | — | нет |
| Checkbox / Switch / Radio | `checkbox` / `switch` / `radio-group` | — | Switch/Slider — да |
| Dialog / Alert Dialog | `dialog` / `alert-dialog` | — | да |
| Select / Combobox / Popover | `select` / `combobox` / `popover` | — | да |
| Toast | `toast` | — | да |
| Table / Avatar / Skeleton / Spinner / Kbd / Breadcrumb / Progress / Scroll Area / Item / Empty / Pagination / Native Select / Textarea / Accordion / Command / Sidebar / Slider / Drawer / Button Group / Input Group / Chart / Theme Switcher | см. references/components.md | — | часть |

Подробности и полный HTML — в `references/components.md`; установка, JS-импорты и lifecycle —
в `references/installation.md`.

## Правила использования в этом проекте

1. Не подключайте JS-бандлы Basecoat целиком: панель — SolidJS, интерактив реализуется реактивностью
   Solid (см. пример tabs ниже). JS-контроллеры Basecoat нужны только там, где нет своего стейт-менеджмента.
2. Tailwind-утилиты применяются вместе с классами Basecoat (`class="btn rounded-full"`).
3. Инлайн-SVG-иконки: Basecoat не содержит иконок; в проекте используются inline Lucide-SVG.
   Для иконок в текстовых кнопках/бейджах — `data-icon="inline-start|inline-end"`.
4. Иконочные кнопки: `data-size="icon"` + обязательный `aria-label`.

### Пример: tabs на SolidJS без JS-контроллера

```tsx
const [tab, setTab] = createSignal<'components' | 'stores'>('components');

<div class="tabs w-full">
  <nav role="tablist" aria-orientation="horizontal" class="w-full">
    <button type="button" role="tab" aria-selected={tab() === 'components'} tabindex={tab() === 'components' ? 0 : -1} onClick={() => setTab('components')}>
      Components
    </button>
    <button type="button" role="tab" aria-selected={tab() === 'stores'} tabindex={tab() === 'stores' ? 0 : -1} onClick={() => setTab('stores')}>
      Stores
    </button>
  </nav>
  <div role="tabpanel" hidden={tab() !== 'components'}>…</div>
  <div role="tabpanel" hidden={tab() !== 'stores'}>…</div>
</div>
```

## Источники

- Документация: https://basecoatui.com/ (installation, customization, /components/<name>)
- Markdown-версии страниц (удобно для агентов): https://basecoatui.com/components/<name>.md
- Репозиторий: https://github.com/hunvreus/basecoat
