import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

import { makeApp } from 'orchid';

import { createTelemetryPlugin } from '../plugin-opentelemetry';

import { addOneTask, getListTask, mainTask } from './example-task';

describe('Opentelemetry Plugin', () => {
  it('Tracks simple Input / Output', async () => {
    const { app, exporter } = getApp();

    await app.run(addOneTask, 3);
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const [span] = spans;
    expect(span).toHaveProperty('name', 'addOne');
    expect(span).toHaveProperty('attributes.input', 3);
    expect(span).toHaveProperty('attributes.output', 4);
  });

  it('Tracks Logs', async () => {
    const { app, exporter } = getApp();

    await app.run(getListTask, 3);
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const [span] = spans;
    expect(span).toHaveProperty('name', 'getList');

    const events = span.events;
    expect(events).toHaveLength(1);
    const [event] = events;
    expect(event).toHaveProperty('name', 'log');
    expect(event).toHaveProperty('attributes.level', 'info');
    expect(event).toHaveProperty(
      'attributes.message',
      'Creating list with length 3'
    );
  });

  it('Tracks child runs', async () => {
    const { app, exporter } = getApp();

    await app.run(mainTask, undefined);
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(8);

    const traceIds = Array.from(
      new Set(spans.map((a) => a.spanContext().traceId))
    );
    expect(traceIds).toHaveLength(1);

    const mains = spans.filter((s) => s.name === 'main');
    expect(mains).toHaveLength(1);
    const [main] = mains;
    const mainId = main.spanContext().spanId;

    const getLists = spans.filter((s) => s.name === 'getList');
    expect(getLists).toHaveLength(1);
    const [getList] = getLists;
    expect(getList.parentSpanId).toEqual(mainId);

    const lists = spans.filter((s) => s.name === 'list');
    expect(lists).toHaveLength(1);
    const [list] = lists;
    expect(list.parentSpanId).toEqual(mainId);
    const listId = list.spanContext().spanId;

    const addOnes = spans.filter((s) => s.name === 'addOne');
    expect(addOnes).toHaveLength(4);
    addOnes.forEach((s) => expect(s.parentSpanId).toEqual(listId));
  });

  it('Tracks exceptions', async () => {
    const { app, exporter } = getApp();

    try {
      await app.run(() => {
        throw new Error('Capture me');
      }, undefined);
    } catch (e) {
      expect(e).toHaveProperty('message', 'Capture me');
    } finally {
      const spans = exporter.getFinishedSpans();

      expect(spans).toHaveLength(1);
      const [span] = spans;
      const events = span.events;
      expect(events).toHaveLength(1);
      const [event] = events;
      expect(event).toHaveProperty('name', 'exception');
      expect(event).toHaveProperty(['attributes', 'exception.type'], 'Error');
      expect(event).toHaveProperty(
        ['attributes', 'exception.message'],
        'Capture me'
      );
      expect(event).toHaveProperty(['attributes', 'exception.stacktrace']);
    }
  });
});

function getApp() {
  const app = makeApp();

  const provider = new NodeTracerProvider();
  const exporter = new InMemorySpanExporter();
  const processor = new SimpleSpanProcessor(exporter);
  provider.addSpanProcessor(processor);
  provider.register();

  const telemetryPlugin = createTelemetryPlugin({ provider });

  app.use(telemetryPlugin);
  return { app, exporter };
}
