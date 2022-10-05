import { describe, it, Mock } from 'vitest';
import { makeApp, TaskSpecObject } from 'orchid';

import { CacheResult, CacheStorage } from './cache.types';
import { createCachePlugin, TaskCacheExtension } from './cache-plugin';

describe('Plugin Cache', () => {
  it('Can cache calls', async () => {
    const { app } = getApp();
    const spy = vitest.fn((a) => a * 2);
    const task = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
    });

    const result = await app.run(task, 3);
    expect(result).toEqual(6);
    expect(spy).toHaveBeenCalledOnce();

    await app.run(task, 3);
    expect(spy).toHaveBeenCalledTimes(1);

    await app.run(task, 4);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('Can invalidate cache', async () => {
    const { app } = getApp();
    const spy = vitest.fn((a) => a);
    const task = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
    });
    await app.run(task, 3);
    await app.run(task, 3);
    expect(spy).toHaveBeenCalledOnce();

    const taskMigrated = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
      onPostLoad() {
        return null;
      },
    });
    await app.run(taskMigrated, 3);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it.todo('Migrate cache (+ check meta after)');
  it.todo('Cache meta not upgraded if result is the same');
});

function getApp() {
  const app = makeApp();
  const storage = makeMemoryStorage();
  app.use(
    createCachePlugin({
      storage,
    })
  );
  return { app, storage };
}

function makeTask(spy: Mock, cache?: TaskCacheExtension<number, number>) {
  const task: TaskSpecObject<number, number> = {
    name: 'example',
    run(input: number) {
      return spy(input);
    },
    cache,
  };
  return task;
}

function makeMemoryStorage(): CacheStorage & {
  getData(): Record<string, CacheResult<any>>;
} {
  const data: Record<string, CacheResult<any>> = {};
  return {
    load(key) {
      return data[key];
    },
    save(key, value) {
      data[key] = value;
    },
    getData() {
      return data;
    },
  };
}
