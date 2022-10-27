import { ok } from 'assert';

import {
  SpanKind,
  SpanStatus,
  Attributes,
  Link,
  SpanContext,
} from '@opentelemetry/api';
import { TimedEvent, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';

export type BaseSpan = Omit<
  ReadableSpan,
  // OMIT
  | 'ended'
  | 'instrumentationLibrary'
  | 'spanContext'
  // @TODO: ressource does probably make sense to add
  | 'resource'
  // Different format
  | 'startTime'
  | 'endTime'
  | 'duration'
> & {
  traceId: string;
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
};

export class SpanItem implements BaseSpan {
  name: string;
  kind: SpanKind;
  parentSpanId?: string | undefined;
  status: SpanStatus;
  attributes: Attributes;
  links: Link[];
  events: TimedEvent[];
  resource: Resource;
  traceId: string;
  spanContext: SpanContext;
  id: string;
  startTime: number;
  endTime: number;
  duration: number;

  children: Array<SpanItem>;
  parent?: SpanItem;

  constructor(span: BaseSpan) {
    this.name = span.name;
    this.kind = span.kind;
    this.status = span.status;
    this.attributes = span.attributes;
    this.links = span.links;
    this.events = span.events;
    this.id = span.id;
    this.traceId = span.traceId;

    this.duration = span.duration;
    this.startTime = span.startTime;
    this.endTime = span.endTime;

    this.children = [];
  }

  addChildren(spans: BaseSpan[]) {
    spans.forEach((c) => {
      ok(
        c.parentSpanId === this.id,
        `Trying to add a child to ${this.id}, but the child has ${c.parentSpanId} as parent`
      );
      const item = new SpanItem(c);
      item.setParent(this);
      this.children.push(item);
    });
  }

  setParent(parent: SpanItem) {
    this.parent = parent;
  }
}
