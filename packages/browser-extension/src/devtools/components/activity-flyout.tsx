import { createSignal, For, Show } from 'solid-js';
import { activityEntries, clearActivity } from '../state/activity';

const [isActivityOpen, setIsActivityOpen] = createSignal(false);

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString(window.navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function ActivityFlyout() {
  return (
    <div class="relative">
      <button
        data-testid="activity-button"
        data-tooltip="Change activity"
        data-side="bottom"
        aria-label="Change activity"
        class="flex items-center justify-center w-8 h-8 text-white rounded-full hover:bg-alpine-300 focus:outline-none leading-4"
        onClick={() => setIsActivityOpen(!isActivityOpen())}
      >
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <Show when={activityEntries().length > 0}>
          <span
            class="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-400 animate-pulse"
            data-testid="activity-indicator"
          />
        </Show>
      </button>
      <Show when={isActivityOpen()}>
        <div
          data-testid="activity-flyout"
          class="absolute right-0 bottom-full z-40 mb-2 w-80 max-h-80 overflow-scroll bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-100 border border-gray-300 dark:border-gray-500 shadow-lg rounded-md text-sm"
        >
          <div class="flex items-center justify-between px-3 py-2 border-b border-gray-300 dark:border-gray-500 font-bold">
            <span>Change activity</span>
            <button
              data-testid="activity-clear-button"
              class="text-xs underline cursor-pointer"
              onClick={() => clearActivity()}
            >
              Clear
            </button>
          </div>
          <Show
            when={activityEntries().length > 0}
            fallback={
              <div class="p-4 opacity-60" data-testid="activity-empty">
                No changes recorded yet. Interact with the page and changed data will appear here.
              </div>
            }
          >
            <For each={activityEntries()}>
              {(entry) => (
                <div
                  class="px-3 py-2 border-b border-gray-200 dark:border-gray-600 font-mono"
                  data-testid="activity-entry"
                >
                  <div class="flex items-center gap-2 whitespace-nowrap">
                    <span class="opacity-60 text-xs">{formatTime(entry.at)}</span>
                    <span
                      class="badge"
                      data-variant={entry.source === 'store' ? 'secondary' : undefined}
                    >
                      {entry.source}
                    </span>
                    <span class="truncate font-bold">{entry.targetName}</span>
                  </div>
                  <div class="mt-1 flex flex-wrap gap-1" data-testid="activity-entry-keys">
                    <For each={entry.keys.slice(0, 5)}>
                      {(key) => (
                        <span class="badge" data-variant="outline">
                          {key}
                        </span>
                      )}
                    </For>
                    <Show when={entry.keys.length > 5}>
                      <span class="opacity-60 text-xs">+{entry.keys.length - 5} more</span>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </div>
  );
}
