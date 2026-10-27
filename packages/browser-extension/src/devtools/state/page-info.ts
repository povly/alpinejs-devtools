import { createMemo, createSignal } from 'solid-js';
import type { PageInfo } from '../types';

const [pageInfo, setPageInfoSignal] = createSignal<PageInfo | undefined>(undefined);

export const setPageInfo = (info: PageInfo) => {
  setPageInfoSignal(info);
  console.debug('[alpine-devtools] page info updated', {
    version: info.alpineVersion,
    directives: info.directives.length,
    plugins: info.plugins.length,
    scripts: info.scripts.length,
  });
};

export { pageInfo };

export const pageScripts = createMemo(() => pageInfo()?.scripts ?? []);

export const detectedTools = createMemo(() => {
  const ecosystem = pageInfo()?.ecosystem;
  if (!ecosystem) return [];
  const tools: string[] = [];
  if (ecosystem.hasHtmxTarget) tools.push('htmx');
  if (ecosystem.hasAlpineAjaxTarget) tools.push('alpine-ajax');
  if (ecosystem.hasPineconeRouter) tools.push('pinecone');
  if (ecosystem.hasLivewire) tools.push('livewire');
  if (ecosystem.hasLiveView) tools.push('liveview');
  if (ecosystem.hasTurbo) tools.push('turbo');
  return tools;
});

const [scriptFilter, setScriptFilter] = createSignal('');

export { scriptFilter, setScriptFilter };

export const filteredPageScripts = createMemo(() => {
  const filter = scriptFilter().toLowerCase();
  const scripts = pageScripts();
  if (!filter) return scripts;
  return scripts.filter((script) => (script.src ?? 'inline').toLowerCase().includes(filter));
});
