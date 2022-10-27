import { ok } from 'assert';

import type { ISpan } from '@opentelemetry/otlp-transformer';
import { sortBy } from 'lodash';

import { fromOTLPSpan } from './span-parser';
import { BaseSpan, SpanItem } from './SpanItem';

export type Trace = {
  id: string;
  root: SpanItem;
};

export function fromSerializedSpans(spans: ISpan[]): Trace {
  const parsed = spans.map(fromOTLPSpan);
  return toTrace(parsed);
}

export function toTrace(spans: BaseSpan[]): Trace {
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

export function toTree(spans: BaseSpan[]): SpanItem {
  const spansById = Object.fromEntries(spans.map((span) => [span.id, span]));

  const missingParent = spans.filter(
    (s) => !s.parentSpanId || !spansById[s.parentSpanId]
  );
  ok(
    missingParent.length === 1,
    'Expected to have only one span without existing parent'
  );
  const root = missingParent[0];

  return makeItem(root, spans);
}

function addChildren(parent: SpanItem, spans: BaseSpan[]) {
  const children = sortBy(
    spans.filter((s) => s.parentSpanId === parent.id),
    'timestamp'
  );

  parent.addChildren(children);
  parent.children.forEach((child) => {
    addChildren(child, spans);
  });
}

function makeItem(parent: BaseSpan, spans: BaseSpan[]): SpanItem {
  const item = new SpanItem(parent);
  addChildren(item, spans);
  return item;
}
