import { z } from 'zod';
import { Attributes, HrTime } from '@opentelemetry/api';
import { hrTimeToTimeStamp } from '@opentelemetry/core';
import { set, sortBy } from 'lodash';

import { isTruthy } from '@orchid/util';

import { SpanItem } from './SpanItem';

export type TimelineItem =
  | ExceptionItem
  | LogItem
  | EventItem
  | StartItem
  | EndItem
  | ChildItem;

interface BaseTimelineItem {
  type: string;
  timestamp: number;
  duration?: number;
}

interface SerializedException {
  type: string;
  message: string;
  stacktrace: string;
}

export interface ExceptionItem extends BaseTimelineItem {
  type: 'exception';
  exception: SerializedException;
}
export interface LogItem extends BaseTimelineItem {
  type: 'log';
}
export interface EventItem extends BaseTimelineItem {
  type: 'event';
  name: string;
  attributes?: Attributes;
}
export interface StartItem extends BaseTimelineItem {
  type: 'start';
}
export interface EndItem extends BaseTimelineItem {
  type: 'end';
}
export interface ChildItem extends BaseTimelineItem {
  type: 'child';
  name: string;
}

export function getTimeline(span: SpanItem) {
  return sortBy(
    [
      ...getStartEnd(span),
      ...getChildren(span),
      ...getEvents(span),
      ...getExceptions(span),
      ...getLogs(span),
    ],
    'timestamp'
  );
}

function getStartEnd(span: SpanItem): [StartItem, EndItem] {
  const start: StartItem = {
    type: 'start',
    timestamp: span.startTime,
  };
  const end: EndItem = {
    type: 'end',
    timestamp: span.endTime,
  };
  return [start, end];
}

function getChildren(span: SpanItem): ChildItem[] {
  return span.children.map((child) => ({
    type: 'child',
    name: child.name,
    timestamp: child.startTime,
    duration: child.duration,
  }));
}

function getEvents(span: SpanItem): EventItem[] {
  return span.events
    .filter((event) => event.name !== 'exception')
    .map((event): EventItem => {
      return {
        type: 'event',
        name: event.name,
        timestamp: new Date(hrTimeToTimeStamp(event.time)).getTime(),
        attributes: event.attributes,
      };
    });
}

const HrTimeSchema = z
  .tuple([z.number(), z.number()])
  .transform<HrTime>((val) => val as HrTime);
const ExceptionEventSchema = z.object({
  name: z.literal('exception'),
  attributes: z.object({
    'exception.type': z.string(),
    'exception.message': z.string(),
    'exception.stacktrace': z.string(),
  }),
  time: HrTimeSchema,
});
type ExceptionEvent = z.infer<typeof ExceptionEventSchema>;

function getExceptions(span: SpanItem): ExceptionItem[] {
  return span.events
    .filter((e) => e.name === 'exception')
    .map((e) => {
      const parsed = ExceptionEventSchema.safeParse(e);
      if (parsed.success) {
        return parsed.data;
      }
      return null;
    })
    .filter(isTruthy)
    .map((e: ExceptionEvent): ExceptionItem => {
      const nested: { exception?: SerializedException } = {};

      Object.entries(e.attributes).forEach(([key, value]) => {
        if (key.startsWith('exception.')) {
          set(nested, key, value);
        }
      });

      return {
        type: 'exception',
        timestamp: new Date(hrTimeToTimeStamp(e.time)).getTime(),
        exception: nested.exception as SerializedException,
      };
    });
}

/**
 * @TODO: LogEvents will be custom
 */
function getLogs(span: SpanItem): LogItem[] {
  return [];
}
