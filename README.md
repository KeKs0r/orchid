# Orchid

Task orchestrator to help with complex flows in your code. From local development to production.

```typescript
const mainTask: TaskSpec = {
  name: 'main',
  async run(input, { run, log }) {
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

### Progress

- [x] Core API for Task Execution
- [x] API for extending context
- [x] Middleware API for extending pure task execution
- Standard Plugins
  - [x] Cache Plugin
  - [] Logger Plugin
  - [] Error Reporting
- Extended Plugin Ecosystem
  - [ ] Runner for local iteration
  - [ ] Webserver for investigating runs
