// Fork build: telemetry removed — metric helpers are local DEV-only debug logs.
// Upstream sent events via window.sa_event / window.sa_pageview; this fork
// must not perform any network calls for analytics (see
// .ai-factory/plans/alpine-full-debugging.md, Phase 0 task T3).

export function bucketCount(num: number) {
  if (num === 0) return '0';
  if (num === 1) return '1';
  if (num <= 5) return '2-5';
  if (num <= 10) return '6-10';
  if (num <= 20) return '11-20';
  if (num <= 50) return '21-50';
  return '>=51';
}

export function bucketCountLarge(num: number) {
  if (num <= 50) return bucketCount(num);
  if (num <= 100) return '51-100';
  if (num <= 500) return '101-500';
  return '>=501';
}

export function bucketTime(ms: number) {
  if (ms < 5) return '<5ms';
  if (ms <= 10) return '6-10ms';
  if (ms <= 50) return '11-50ms';
  if (ms <= 100) return '51-100ms';
  if (ms <= 150) return '101-150ms';
  if (ms <= 200) return '151-200ms';
  if (ms <= 300) return '201-300ms';
  if (ms <= 500) return '301-500ms';
  if (ms <= 1000) return '501-1000ms';
  if (ms <= 2000) return '1001-2000ms';
  if (ms <= 5000) return '2001-5000ms';
  return `>5000ms`;
}

export function view(pathname: string): void {
  if (import.meta.env.DEV) {
    console.debug('[alpine-devtools] view', pathname);
  }
}

export function metric(
  name: string,
  metadata: Record<string, string | number | boolean> = {},
): void {
  if (import.meta.env.DEV) {
    console.debug('[alpine-devtools] metric', name, metadata);
  }
}

export function sampledMetric(
  name: string,
  metadata: Record<string, string | number | boolean> = {},
): void {
  if (import.meta.env.DEV) {
    console.debug('[alpine-devtools] sampled-metric', name, metadata);
  }
}

export function toolDetector(message: any): string {
  if (!message) {
    return 'error';
  }
  const tools = [];
  if (message.hasHtmxTarget) {
    tools.push('htmx');
  }
  if (message.hasAlpineAjaxTarget) {
    tools.push('alpine-ajax');
  }
  if (message.hasPineconeRouter) {
    tools.push('pinecone');
  }
  if (message.hasLivewire) {
    tools.push('livewire');
  }
  if (message.hasLiveView) {
    tools.push('liveview');
  }
  if (message.hasTurbo) {
    tools.push('turbo');
  }

  return tools.length === 0 ? 'none' : tools.join(',');
}
