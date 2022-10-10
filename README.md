# 🌸 Orchid

Task orchestrator to help with complex flows in your code. From local development to production.

- able to keep/store context (input / output of functions) for debugging purpose
- intercept errors and give context to exactly which inputs lead to the error (+ dedicated logs for that subtask)
- cache certain function calls
- provide context for function calls that are request (e.g. tenantId) dependant
- provide context for calls that relate to items of a worklist (e.g. transforming files in a folder, add current file to context)

```typescript
const mainTask: TaskSpec = {
  name: 'main',
  async run(input, context) {
    const { run, log } = context;
    const list = await run(getListTask, 4);
    log.info('List has so many elements', list.length);
    const sum = await run(sumTask, list);
    return sum;
  },
};
```

## Why an tool for task orchestration?

While building scripts for tasks like scraping, migration and background processing I found myself building the same tools over and over.
Iterating locally when calling a lot of APIs slows down the feedback cycle.
Finding the root cause of an error in a multi step process based on stack traces is not sufficient. Investigating the output of a long process without it intermediates steps is hard.

## Disclaimer

This is currently work in progress, and can't yet be used. If you want to follow the journey and progress:
[@marchoeffl](https://twitter.com/marchoeffl) on Twitter.

## Full Example

```typescript
import { makeApp, TaskContext, TaskSpec } from 'orchid';
import { createCachePlugin } from '@orchid/plugin-cache';
import { makeStorage } from '@orchid/plugin-cache-file';

const app = makeApp();
app.use(
  createCachePlugin({
    storage: makeStorage({
      basePath: __dirname + '/.cache',
    }),
  })
);

app.run(mainTask, 5);

const mainTask: TaskSpec<undefined, Promise<number>> = {
  name: 'main',
  async run(traceId: number, { run, log, setContext }) {
    // I can add something to the context, so all children have access to it
    setContext('traceId', traceId);

    // I can run other tasks
    const list = run(listTask, 4);
    log.info('Successful List', list);
    return list;
  },
};

const listTask = {
  name: 'list',
  async run(
    amount: number,
    { run, log, traceId }: TaskContext
  ): Promise<number> {
    if (traceId > 3) {
      log.debug('WOW the traceId is sooo big');
    }
    const list = Array.from({ length: amount }).map((a, i) => i);
    const doubled = await Promise.all(
      list.map((number) => {
        return run(doubleTask, number);
      })
    );
    const sum = await run(sumTask, doubled);
    return sum;
  },
};

function sumTask(list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}

function doubleTask(input: number, { getContext, log }: TaskContext) {
  log('Doubling for trace', getContext('traceId'));
  return input * 2;
}
```

### Progress

- [x] Core API for Task Execution
- [x] API for extending context
- [x] Middleware API for extending pure task execution
- Standard Plugins
  - [x] Cache Plugin
  - [ ] Logger Plugin
  - [ ] Error Reporting
- Extended Plugin Ecosystem
  - [ ] Runner for local iteration
  - [ ] Webserver for investigating runs
