import { createMemo } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import { effect } from 'solid-js/web';
import { lastChange } from './reactivity';

export interface ActivityEntry {
  id: number;
  at: number;
  source: 'component' | 'store';
  targetName: string;
  keys: string[];
}

const ACTIVITY_SIZE = 100;

const [activity, setActivity] = createStore<{ entries: ActivityEntry[] }>({ entries: [] });

let nextEntryId = 1;

effect(() => {
  const change = lastChange();
  if (!change) {
    return;
  }
  const entry: ActivityEntry = {
    id: nextEntryId++,
    at: change.at,
    source: change.source,
    targetName: change.targetName,
    keys: change.keys,
  };
  const entries = [entry, ...unwrap(activity).entries];
  if (entries.length > ACTIVITY_SIZE) {
    entries.length = ACTIVITY_SIZE;
  }
  setActivity('entries', reconcile(entries));
});

export function clearActivity() {
  setActivity('entries', reconcile([]));
}

export const activityEntries = createMemo(() => activity.entries);
