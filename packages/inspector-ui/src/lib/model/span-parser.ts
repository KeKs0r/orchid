import { ok } from 'assert';

import type { ISpan, IEvent, ILink } from '@opentelemetry/otlp-transformer';
import { ESpanKind } from '@opentelemetry/otlp-transformer';
import { HrTime, SpanStatusCode, Link } from '@opentelemetry/api';
import { TimedEvent } from '@opentelemetry/sdk-trace-base';
import { TraceState } from '@opentelemetry/core';

import { BaseSpan } from './SpanItem';

const MILLI_TO_NANO = 1000000;

export function fromOTLPSpan(span: ISpan): BaseSpan {
  return {
    id: span.spanId,
    name: span.name,
    traceId: span.traceId,
    parentSpanId: span.parentSpanId,
    status: mapStatus(span.status),
    attributes: mapAttributes(span.attributes),
    startTime: nanoToTimeStamp(span.startTimeUnixNano),
    endTime: nanoToTimeStamp(span.endTimeUnixNano),
    duration: nanoToTimeStamp(span.endTimeUnixNano - span.startTimeUnixNano),
    events: span.events.map(mapEvent),
    kind: mapKind(span.kind),
    links: span.links.map(mapLink),
  };
}

function nanoToTimeStamp(nano: number): number {
  return Math.round(nano / 1000);
}

function mapAttributes(
  attributes: ISpan['attributes']
): BaseSpan['attributes'] {
  const asObject = Object.fromEntries(
    attributes.map((att) => [att.key, att.value])
  );
  return asObject as BaseSpan['attributes'];
}

function mapEvent(event: IEvent): TimedEvent {
  return {
    name: event.name,
    time: nanoToHrTime(event.timeUnixNano),
    attributes: mapAttributes(event.attributes),
  };
}

function mapLink(link: ILink): Link {
  const traceState = new TraceState(link.traceState);
  return {
    context: {
      spanId: link.spanId,
      traceId: link.traceId,
      traceState,
      // Could be 0 or 1, nor really reading it right now
      traceFlags: 0,
    },
    attributes: mapAttributes(link.attributes),
  };
}

function nanoToHrTime(time: number): HrTime {
  const milliseconds = time / MILLI_TO_NANO;
  const ms = Math.floor(milliseconds);
  const remaining = time - ms * MILLI_TO_NANO;
  return [ms, remaining];
}

function mapKind(kind: ISpan['kind']): BaseSpan['kind'] {
  ok(kind !== ESpanKind.SPAN_KIND_UNSPECIFIED, 'Got unspecified spankind');
  return kind - 1;
}
function mapStatus(status: ISpan['status']): BaseSpan['status'] {
  return {
    message: status.message,
    code: status.code as unknown as SpanStatusCode,
  };
}
