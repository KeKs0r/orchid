import type { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { ok } from 'assert';
import { sortBy } from 'lodash';
import { SpanItem } from './SpanItem';

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
// export type SpanItem = RawSpan & { children: SpanItem[]; parent?: SpanItem };

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

export function getBreadcrumbs(root: SpanItem): SpanItem[] {
  const before = root.parent ? getBreadcrumbs(root.parent) : [];
  return [...before, root];
}

export function toTree(spans: RawSpan[]): SpanItem {
  const spansById = Object.fromEntries(spans.map((span) => [span.id, span]));

  const missingParent = spans.filter((s) => !spansById[s.parentId]);
  ok(
    missingParent.length === 1,
    'Expected to have only one span without existing parent'
  );
  const root = missingParent[0];

  return makeItem(root, spans);
}

function addChildren(parent: SpanItem, spans: RawSpan[]) {
  const children = sortBy(
    spans.filter((s) => s.parentId === parent.id),
    'timestamp'
  );

  parent.addChildren(children);
  parent.children.forEach((child) => {
    addChildren(child, spans);
  });
}

function makeItem(parent: RawSpan, spans: RawSpan[]): SpanItem {
  const item = new SpanItem(parent);
  addChildren(item, spans);
  return item;
}
