![Chrome Web Store](https://img.shields.io/chrome-web-store/v/fopaemeedckajflibkpifppcankfmbhk)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/fopaemeedckajflibkpifppcankfmbhk?label=chrome%20users%20%28weekly%29)
![Mozilla Add-on](https://img.shields.io/amo/v/alpinejs-devtools?label=firefox%20add-on)
![Mozilla Add-on](https://img.shields.io/amo/users/alpinejs-devtools?label=firefox%20users%20%28daily%29)

## Chrome Web Store Notice

Due to Chrome's Manifest v3 rollout, the extension had to be rewritten. As part of this we've launched a [**Paid Early Access Program**](https://alpinedevtools.com/pricing).

**Free Extension** includes:

- ✅ Component state inspection/editing
- ✅ More reliable state updates/sync (🆕)
- ✅ Highlight component in page on hover
- ✅ Component data in console globals
- ✅ High performance on nested data objects (🆕️, tested on ~10k data properties)
- ✅ Component filtering (🆕)

**Early Access** includes:

- ✅ Store state viewing/editing (🆕)
- ✅ Store data in console globals (🆕)
- ✅ Warnings tab (inc. Alpine v3 support)
- ✅ Jump to root element/scroll element into view (🆕)
- ✅ Time travel debugging of $data (🆕)

# Alpine.js devtools

## Fork notice

This is a personal fork with all Early Access features unlocked and no telemetry:

- All previously paid features (stores inspection, warnings, time travel, jump-to-element, data pinning) are available without a license.
- License checks, trial banners and analytics (`sa_event`/`sa_pageview`, checkoutpage.co) have been removed.
- New: **Page tab** — Alpine version, directives used, plugins, ecosystem tools (htmx, Turbo, Livewire, …) and the script inventory of the inspected page.
- New: **Reactive change tracking** — changed data keys flash in the inspector, get badges in component/store lists and are recorded in a footer activity log. See [FEATURES.md](./FEATURES.md).
- Limitation: stores require Alpine v3.8+ (backend restriction, unchanged).

## Fork installation (from source)

### Build

Prerequisites: Node ^24, pnpm ^10.

```bash
pnpm install
pnpm build
```

Outputs (repo root `dist/`):

| Path | Target |
|---|---|
| `dist/browser-extension/` | Chrome/Chromium — load unpacked |
| `dist/firefox-ext/` | Firefox / Zen — unpacked, with the Firefox manifest |

Package a Firefox `.xpi` (when needed):

```bash
cd dist/firefox-ext && python3 -m zipfile -c ../alpine-devtools-fork.xpi *
```

### Chrome / Chromium

1. Open `chrome://extensions`, enable **Developer mode**
2. **Load unpacked** → select `dist/browser-extension`

### Firefox / Zen Browser — temporary load (dev path, no signature needed)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Pick `dist/alpine-devtools-fork.xpi` (or `manifest.json` inside `dist/firefox-ext`)
4. Open a page with Alpine.js → DevTools (F12) → **Alpine** panel

The add-on disappears after a browser restart — just load it again. Do NOT use
`about:addons` → "Install Add-on From File…" for the unsigned build: the normal
install path always requires a Mozilla signature ("is not verified" error).

### Firefox / Zen Browser — permanent install

- **Quick try:** `about:config` → `xpinstall.signatures.required` → `false`, then
  `about:addons` → gear → *Install Add-on From File…*. Works in some Zen builds,
  ignored in others.
- **Reliable:** sign via AMO ("unlisted" — not published to the store):
  1. Get API keys: <https://addons.mozilla.org/developers/addon/api/key/>
  2. Replace `browser_specific_settings.gecko.id` in `packages/browser-extension/build.js`
     with your own ID (the current one belongs to upstream), then rebuild
  3. `npx web-ext sign --source-dir ./dist/firefox-ext --channel unlisted --api-key KEY --api-secret SECRET`
  4. Install the signed `.xpi` via *Install Add-on From File…*

### Development

- Simulator (panel + fake page, no browser needed): `pnpm start` → <http://localhost:3000/simulator>
- Firefox/Zen dev loop with auto-reload:
  `npx web-ext run --source-dir ./dist/firefox-ext --firefox-binary <path-to-browser>`
- Checks: `pnpm run format` · `pnpm typecheck` · `pnpm t` (unit) · `pnpm pw:run` (E2E)

![Screenshot of Alpine.js devtools](docs/devtools-only.png)

Alpine.js devtools is a simple extension to help you debug [Alpine.js](https://github.com/alpinejs/alpine) components easily.

> This extension is heavily inspired by [Vue devtools](https://github.com/vuejs/vue-devtools), but customized for a unique Alpine.js developer experience.

## Installation

- [Get the Chrome Extension](https://chrome.google.com/webstore/detail/alpinejs-devtools/fopaemeedckajflibkpifppcankfmbhk)
- [Get the Firefox Extension](https://addons.mozilla.org/firefox/addon/alpinejs-devtools/)

**Note:** if you are using Google Chrome, Alpine.js devtools will not work with local files unless you configure the extension to be allowed `Access to File URLs`.

You can allow it by following these steps:

1. Open chrome settings
2. Go to `extensions` tab
3. Choose `Alpine.js devtools` and press details
4. Enable `Allow access to file URLs`

![Allow access to file URLs permission](docs/alpine-devtools-chrome-permission.png)

## Identifying Components

Unlike other frameworks, Alpine does not include named components. Therefore by default, Alpine.js devtools will attempt to identify component names from the following attributes, in order: `id`, `name`, `aria-label`, `x-data` (the function name), `role`, and finally the `tagName`.

> You may also override these with either `x-title` or `x-id`.

## Development

### Prerequisites

- Node ^24.x
- pnpm ^10.x

### Chrome

1. Clone this repo
2. Run `pnpm install`
3. Run `pnpm build:dev` (or `pnpm build` to test a production build)
4. Load unpacked extension inside [dist/chrome](./dist/chrome) directory
5. Open any HTML file that imports Alpine.js then inspect with Chrome DevTools. You should now have an Alpine.js panel available.

### Firefox

1. Follow the [Development](#development) instructions to get a development build.
2. Go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in Firefox
3. Ensure you are on the "This Firefox" tab (see the left side nav)
4. Click "Load Temporary Add-on..."
5. Open any of the files in the built extension folder ([./dist/chrome](./dist/chrome))
6. Open any HTML file that imports Alpine.js then inspect with Firefox DevTools. You should now have an Alpine.js panel available.

### Running the Alpine.js devtools simulator

A devtools simulator is provided in order to run tests and have an easier development workflow.

Note that when using the simulator all Chrome/Firefox devtools/Extension APIs are faked so it's useful if working on the Extension Backend (which runs in the end user's window, see `packages/shell-chrome/src/backend.js`) or the Alpine.js app which runs in the devtools panel (entrypoint: `packages/shell-chrome/src/devtools/app.js`).

1. Clone this repo
2. Run `pnpm install`
3. Run `pnpm start`
4. Open [http://locahost:8080](http://locahost:8080) (default port is 8080, you can override the port using the `PORT` environment variable. eg. `PORT=5000 pnpm start` will start the simulator on [http://localhost:5000](http://localhost:5000))
5. You'll see a page with our sample Alpine.js app, [example.html](./packages/simulator/example.html), running in the top half of the screen and the [devtools simulator](./packages/simulator/dev.js) running in the bottom half of the screen.

### Testing

We have 2 levels of tests in the project:

- unit tests in [./tests](./tests), written and run with `node:test`
  - The command to run them is `pnpm test`.
- E2E tests that run against the devtools simulator, in [./cypress](./cypress), using [Cypress](https://cypress.io).
  - The command to run Cypress tests is `pnpm cy:run`
  - The command to open the Cypress UI is `pnpm cy:open`
  - **Note** in order to run any Cypress tests, you'll need the simulator running (see [Running the Alpine.js devtools simulator](#running-the-alpinejs-devtools-simulator)).

### Formatting/Linting

Code is auto-formatted using Prettier, see the config at [.prettierrc.js](./.prettierrc.js).

On push, a GitHub Action will auto-format your changes.

On commit, there's a husky + lint-staged hook that runs and auto-formats your changes (unless you disable pre-commit hooks).

## License

[MIT](LICENSE.md)
