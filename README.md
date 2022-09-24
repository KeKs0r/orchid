### API

### Task Definition

```typescript
const mainTask: TaskSpec = {
  name: 'main',
  async run(input, { run, log }) {
    const list = await run('list', 4);
    log.info('Successful List', list);
  },
};
```

### Task Execution

```typescript
/**
 *  This api is not really fixed yet
 */
const process = buildProcess([mainTask]);
await process.run('main');
```

### Plugins

- All functionality can be implemented via plugins (= the middleware pattern)
- this includes core functionality as well as long tail
  - caching
  - error reporting & recovery (console-reporter)

```typescript
export const plugin: PluginDefinition<{ threshold: number }> = {
  name: 'array-log',
  middleware: (options) => async (input, context, next) => {
    if (Array.isArray(input) && input.length > options.threshold) {
      context.log.debug('Array Input', input.length);
    }
    const result = await next(input, context);
    if (Array.isArray(result && result.length > options.threshold)) {
      context.log.debug('Array Result', result.length);
    }
    return result;
  },
};
```

```typescript
/**
 * Process with middleware
 */
const process = buildProcess([mainTask], [middleware]);
await process.run('main');
```

```typescript
/**
 * Alternative API
 */
const app = new App();
app.register(mainTask);
app.use(middleware);

await process.run('main');
```
