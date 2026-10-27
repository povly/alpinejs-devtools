import { createMemo } from 'solid-js';

/**
 * Fork build: all devtools features are always unlocked.
 * The upstream Early Access Program gating, 7-day trial and license
 * activation were removed in this fork.
 * See .ai-factory/plans/alpine-full-debugging.md (Phase 0).
 */
const ALL_FEATURES_UNLOCKED = true;

export const isEarlyAccess = createMemo(() => ALL_FEATURES_UNLOCKED);
