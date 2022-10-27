import { SpanStatusCode } from '@opentelemetry/api';

import { SpanItem } from './SpanItem';

export type UISpanStatus = 'error' | 'warn' | 'success';

export function getStatus(span: SpanItem): UISpanStatus {
  if (
    span.status.code === SpanStatusCode.ERROR ||
    hasExceptionEvent(span.events)
  ) {
    return 'error';
  }
  /**
   * Check for warning scenarios
   * - logger was called with warning
   * - @todo: Add "warn" flag to detect a warning type
   */
  return 'success';
}

function hasExceptionEvent(events: SpanItem['events']) {
  return events.some((e) => e.name === 'exception');
}
