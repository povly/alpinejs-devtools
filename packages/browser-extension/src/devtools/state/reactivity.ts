import { createSignal } from 'solid-js';

export interface DataChange {
  source: 'component' | 'store';
  targetId: number | string;
  targetName: string;
  keys: string[];
  at: number;
}

const FLASH_DURATION_MS = 1600;

const [lastChange, setLastChangeSignal] = createSignal<DataChange | undefined>(undefined);

let clearTimer: ReturnType<typeof setTimeout> | undefined;

export function registerDataChange(
  source: DataChange['source'],
  targetId: number | string,
  targetName: string,
  keys: string[] | undefined,
) {
  if (!keys || keys.length === 0) {
    return;
  }
  setLastChangeSignal({ source, targetId, targetName, keys, at: Date.now() });
  console.debug(`[alpine-devtools] ${source} "${targetName}" changed: ${keys.join(', ')}`);
  if (clearTimer) {
    clearTimeout(clearTimer);
  }
  clearTimer = setTimeout(() => setLastChangeSignal(undefined), FLASH_DURATION_MS);
}

export { lastChange };
