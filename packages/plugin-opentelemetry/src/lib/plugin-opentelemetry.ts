import type { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Tracer, trace, context as otContext, Span } from '@opentelemetry/api';

import { Middleware, TaskContext } from 'orchid';

import { wrapContext } from './wrap-context';

interface OpenTelemetryPluginOptions {
  provider: NodeTracerProvider;
}
export function createTelemetryPlugin(
  options: OpenTelemetryPluginOptions
): Middleware {
  const { provider } = options;
  provider.register();
  const tracer = provider.getTracer('orchid');

  const middleware: Middleware = async (task, input, context, next) => {
    const currentSpan = getOrInitCurrentSpan(context, tracer);

    const spanCtx = trace.setSpan(otContext.active(), currentSpan);
    const nextSpan = tracer.startSpan(task.name, undefined, spanCtx);

    context.setContext('span', nextSpan);
    nextSpan.setAttribute('input', input);

    const wrappedContext = wrapContext(context, nextSpan);
    try {
      const result = await next(input, wrappedContext);

      nextSpan.setAttribute('output', result);
      nextSpan.end();
      return result;
    } catch (e: any) {
      nextSpan.recordException(e);
      nextSpan.end();
      throw e;
    }
  };
  return middleware;
}

function getOrInitCurrentSpan(ctx: TaskContext, tracer: Tracer) {
  const previousSpan = ctx.getContext('span');
  if (previousSpan) {
    return previousSpan;
  }
  const rootSpan = tracer.startSpan('root', { root: true });
  return rootSpan;
}
