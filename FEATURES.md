# Alpine.js Devtools — Features (fork)

This fork unlocks every devtools feature and adds page-environment inspection and reactive change tracking. No license checks, no telemetry.

## Components

- Component tree discovery (Alpine v2 & v3) with nesting depth
- Inspect and edit component state (strings, numbers, booleans, nested objects/arrays)
- Highlight components in page on hover; inspector mode; right-click inspect
- Scroll to component root / inspect it in the Elements tab
- Component filtering; pin data paths
- Console globals `$x0…$xN`
- Time-travel debugging: history of `$data` snapshots (up to 500) with apply/restore
- Live reactive sync of component data

## Stores (Alpine v3.8+)

- Inspect and edit store state; console globals `$s0…$sN`
- Live reactive sync of store data
- Stores are not supported by the backend on Alpine v2 (documented in the Page tab)

## Warnings

- Alpine expression errors (v2.8.1+): eval errors, `x-on` errors, initialisation errors
- Jump to the element that caused the error
- Unlimited list (no free-tier cutoff)

## Page (new in this fork)

- Alpine version and v2/v3 detection
- Directives used on the page (from `x-*` / `:` / `@` attributes)
- Registered plugins (when the Alpine build exposes the plugin registry)
- Ecosystem tools detection: htmx, alpine-ajax, Pinecone Router, Livewire, LiveView, Turbo
- Script inventory (`document.scripts`): src/inline, module, async, defer flags, inline size, with filtering

## Change activity (new in this fork)

- Backend computes `changedKeys` diffs for every component/store data update
- Flash highlight of changed rows in the component/store inspector
- "Recently changed" pulse badges in component and store lists
- Activity flyout (footer) logging the last 100 changes: time, target, changed keys
