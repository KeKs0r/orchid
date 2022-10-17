import { Span } from '@opentelemetry/api';

import { LogFn, Logger, LogLevel, TaskContext } from 'orchid';

export function wrapContext(ctx: TaskContext, span: Span): TaskContext {
  return {
    ...ctx,
    log: wrapLogger(ctx.log, span),
  };
}

function wrapLogger(logger: Logger, span: Span): Logger {
  return Object.fromEntries(
    Object.entries(logger).map(([level, fn]) => [
      level,
      wrapLogLeveL(fn, level as LogLevel, span),
    ])
  ) as Logger;
}

function wrapLogLeveL(fn: LogFn, level: LogLevel, span: Span): LogFn {
  return (...args) => {
    const [f, ...rest] = args;

    span.addEvent('log', {
      level,
      ...getLogPayload(args),
    });

    fn(f, ...rest);
  };
}

function getLogPayload(args: unknown[]) {
  if (args.length === 1) {
    const [msg] = args;
    if (isPrimitive(msg)) {
      return {
        message: `${msg}`,
      };
    }
  }
  const primitiveArgs = args.filter(isPrimitive);
  const onlyPrimitives = primitiveArgs.length === args.length;
  if (onlyPrimitives) {
    return {
      message: primitiveArgs.join(' '),
    };
  }

  const firstNonPrimitive = args.findIndex((a) => !isPrimitive(a));
  if (firstNonPrimitive > 0) {
    const primitiveBeginning = primitiveArgs.slice(0, firstNonPrimitive);
    return {
      message: [primitiveBeginning, '...'].join(' '),
      json: JSON.stringify(args),
    };
  }

  return {
    message: '<Complex Log>',
    json: JSON.stringify(args),
  };
}

type FN = (...args: any[]) => any;
type Primitive = boolean | string | number | Date | null | undefined;
type Composite = Array<Primitive> | Record<string, Primitive> | Primitive;
type Value = Composite | Record<string, Composite> | Composite[] | FN;

function isPrimitive(val: Value | unknown): val is Primitive {
  if (val === null) {
    return true;
  }

  if (
    typeof val == 'object' ||
    typeof val == 'function' ||
    Array.isArray(val)
  ) {
    return false;
  }
  return true;
}
