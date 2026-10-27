import { For, Show } from 'solid-js';
import {
  detectedTools,
  filteredPageScripts,
  pageInfo,
  scriptFilter,
  setScriptFilter,
} from '../state/page-info';
import { storesValue } from '../state/stores';

function scriptLabel(src: string | null): string {
  if (!src) return '(inline)';
  return src.split('/').pop() || src;
}

export function PageInfo() {
  return (
    <div class="flex h-full w-full overflow-hidden" data-testid="page-tab-content">
      <div
        class="flex-1 max-h-full overflow-scroll text-gray-600 dark:text-gray-100 text-sm"
        data-testid="page-info-scroll-container"
      >
        <Show
          when={pageInfo()}
          fallback={
            <div
              data-testid="page-info-empty"
              class="flex flex-1 h-full w-full items-center justify-center p-4 text-gray-400 text-sm"
            >
              Waiting for page information…
            </div>
          }
        >
          <section
            data-testid="page-alpine-section"
            class="p-3 border-b border-gray-300 dark:border-gray-500"
          >
            <h2 class="font-bold text-base mb-2">Alpine</h2>
            <div data-testid="page-alpine-version" class="font-mono">
              Alpine.js v{pageInfo()!.alpineVersion || '—'}
            </div>
            <div class="mt-1">
              Stores:{' '}
              <Show
                when={pageInfo()!.isV3}
                fallback={<span data-testid="page-stores-unsupported">requires Alpine v3</span>}
              >
                <span data-testid="page-stores-count">{storesValue().length}</span>
              </Show>
            </div>
            <div class="mt-3">
              <h3 class="opacity-75 mb-1">
                Directives used{' '}
                <span data-testid="page-directives-count">({pageInfo()!.directives.length})</span>
              </h3>
              <div class="flex flex-wrap gap-1" data-testid="page-directives">
                <For each={pageInfo()!.directives}>
                  {(directive) => (
                    <span class="badge" data-variant="secondary">
                      {directive}
                    </span>
                  )}
                </For>
                <Show when={pageInfo()!.directives.length === 0}>
                  <span class="opacity-60">none detected</span>
                </Show>
              </div>
            </div>
            <div class="mt-3">
              <h3 class="opacity-75 mb-1">
                Plugins <span data-testid="page-plugins-count">({pageInfo()!.plugins.length})</span>
              </h3>
              <div class="flex flex-wrap gap-1" data-testid="page-plugins">
                <For each={pageInfo()!.plugins}>
                  {(plugin) => (
                    <span class="badge" data-variant="secondary">
                      {plugin}
                    </span>
                  )}
                </For>
                <Show when={pageInfo()!.plugins.length === 0}>
                  <span class="opacity-60" data-testid="page-plugins-none">
                    none detected
                  </span>
                </Show>
              </div>
            </div>
          </section>

          <section
            data-testid="page-ecosystem-section"
            class="p-3 border-b border-gray-300 dark:border-gray-500"
          >
            <h2 class="font-bold text-base mb-2">Ecosystem</h2>
            <div class="flex flex-wrap gap-1" data-testid="page-ecosystem-tools">
              <For each={detectedTools()}>{(tool) => <span class="badge">{tool}</span>}</For>
              <Show when={detectedTools().length === 0}>
                <span class="opacity-60" data-testid="page-ecosystem-none">
                  none detected
                </span>
              </Show>
            </div>
          </section>

          <section data-testid="page-scripts-section" class="p-3">
            <h2 class="font-bold text-base mb-2">
              Scripts <span data-testid="page-scripts-count">({filteredPageScripts().length})</span>
            </h2>
            <input
              data-testid="page-scripts-filter"
              type="text"
              placeholder="Filter scripts"
              class="input mb-2 w-full"
              onInput={(e) => setScriptFilter(e.currentTarget.value)}
              value={scriptFilter()}
            />
            <div data-testid="page-scripts-list">
              <For each={filteredPageScripts()}>
                {(script) => (
                  <div
                    class="flex items-center gap-2 px-2 py-1 font-mono"
                    data-testid="page-script-item"
                  >
                    <span class="truncate" title={script.src ?? undefined}>
                      {scriptLabel(script.src)}
                    </span>
                    <Show when={script.isModule}>
                      <span class="badge" data-variant="secondary">
                        module
                      </span>
                    </Show>
                    <Show when={script.isAsync}>
                      <span class="badge" data-variant="secondary">
                        async
                      </span>
                    </Show>
                    <Show when={script.isDeferred}>
                      <span class="badge" data-variant="secondary">
                        defer
                      </span>
                    </Show>
                    <Show when={script.inlineLength != null}>
                      <span class="opacity-60 text-xs">{script.inlineLength}b</span>
                    </Show>
                  </div>
                )}
              </For>
              <Show when={filteredPageScripts().length === 0}>
                <div class="opacity-60 p-2" data-testid="page-scripts-empty">
                  No scripts match the filter.
                </div>
              </Show>
            </div>
          </section>
        </Show>
      </div>
    </div>
  );
}
