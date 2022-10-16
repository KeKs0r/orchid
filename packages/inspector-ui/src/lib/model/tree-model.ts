import type { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { ok } from 'assert';
import { sortBy } from 'lodash';

/**
 * This is the mapping that happens in the ConsoleSpanExporter._exportInfo
 * I think we will use a different exporter / interface for real world.
 * node_modules/@opentelemetry/sdk-trace-base/build/src/export/ConsoleSpanExporter.js
 */
export type RawSpan = Omit<
  ReadableSpan,
  | 'spanContext'
  | 'duration'
  | 'startTime'
  | 'endTime'
  | 'ended'
  | 'resource'
  | 'instrumentationLibrary'
  | 'parentSpanId'
> & {
  traceId: string;
  id: string;
  parentId: string;
  timestamp: number;
  duration: number;
};
export type SpanItem = RawSpan & { children: SpanItem[] };

export type Trace = {
  id: string;
  root: SpanItem;
};

export function toTrace(spans: RawSpan[]): Trace {
  ok(spans.length > 0, 'Trying to create a trace without spans');
  const traceId = spans[0]?.traceId;
  spans.forEach((s) =>
    ok(s.traceId === traceId, 'Need to provide only spans from a single trace')
  );

  return {
    id: traceId,
    root: toTree(spans),
  };
}

export function flattenTree(root: SpanItem): SpanItem[] {
  return [root, ...root.children.flatMap((child) => flattenTree(child))];
}

export function toTree(spans: RawSpan[]): SpanItem {
  const spansById = Object.fromEntries(spans.map((span) => [span.id, span]));

  const missingParent = spans.filter((s) => !spansById[s.parentId]);
  ok(
    missingParent.length === 1,
    'Expected to have only one span without existing parent'
  );
  const root = missingParent[0];
  return getChildren(root, spans);
}

function getChildren(parent: RawSpan, spans: RawSpan[]): SpanItem {
  return {
    ...parent,
    /** We probably want this sorted by "start" */
    children: sortBy(
      spans
        .filter((s) => s.parentId === parent.id)
        .map((s) => getChildren(s, spans)),
      'timestamp'
    ),
  };
}
