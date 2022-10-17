import { SpanKind, SpanStatus, Attributes, Link } from '@opentelemetry/api';
import { TimedEvent } from '@opentelemetry/sdk-trace-base';
import { ok } from 'assert';
import { RawSpan } from './tree-model';

export class SpanItem implements RawSpan {
  name: string;
  kind: SpanKind;
  status: SpanStatus;
  attributes: Attributes;
  links: Link[];
  events: TimedEvent[];
  traceId: string;
  id: string;
  parentId: string;
  timestamp: number;
  duration: number;

  parent?: SpanItem;
  children: SpanItem[];

  constructor(span: RawSpan) {
    this.name = span.name;
    this.kind = span.kind;
    this.status = span.status;
    this.attributes = span.attributes;
    this.links = span.links;
    this.events = span.events;
    this.id = span.id;
    this.traceId = span.traceId;
    this.parentId = span.parentId;
    this.timestamp = span.timestamp;
    this.duration = span.duration;
    this.children = [];
  }

  addChildren(spans: RawSpan[]) {
    spans.forEach((c) => {
      ok(
        c.parentId === this.id,
        `Trying to add a child to ${this.id}, but the child has ${c.parentId} as parent`
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
