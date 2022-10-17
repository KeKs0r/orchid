//nodemon --exec "yarn ts-node packages/logger-terminal/repl/ot-model.repl.ts" -e ts

import { Span, SpanStatusCode, trace, context } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

// import { TraceIdRatioBasedSampler } from '@opentelemetry/core';

main();
async function main() {
  console.log('Start');
  const provider = new NodeTracerProvider({
    // See details of ParentBasedSampler below
  });

  // const exporter = new ConsoleSpanExporter();
  const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4200/api/ingest',
  });
  const processor = new BatchSpanProcessor(exporter);
  provider.addSpanProcessor(processor);

  provider.register();

  const tracer = provider.getTracer('main');

  const rootSpan = tracer.startSpan('root', { root: true });
  async function run(
    name: string,
    fn: (parent: Span) => Promise<unknown>,
    parent: Span
  ) {
    const ctx = trace.setSpan(context.active(), parent);
    const span = tracer.startSpan(name, undefined, ctx);
    await fn(span);
    span.end();
  }

  await run(
    'main',
    async (span) => {
      await wait(5);
      await run(
        'pre',
        async (s) => {
          s.addEvent('myEvent', {
            foo: 'bar',
          });
          s.recordException(new Error('My Exception'));
          wait(10);
        },
        span
      );

      await run(
        'sub',
        async (span) => {
          span.setAttribute('input', JSON.stringify({ foo: 'bar' }));
          const list = Array.from({ length: 5 });

          await Promise.all(
            list.map(async (a, idx) => {
              await wait(10 - idx);
              await run(
                `list_${idx}`,
                async (s) => {
                  if (idx === 2) {
                    s.setStatus({
                      code: SpanStatusCode.ERROR,
                      message: 'I hate index 2',
                    });
                  } else if (idx === 4) {
                    s.setStatus({ code: SpanStatusCode.OK });
                  }
                  await wait(3);
                },
                span
              );
            })
          );
        },
        span
      );
    },
    rootSpan
  );

  await processor.forceFlush();

  console.log('End');
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
