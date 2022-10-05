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
        return `double:${input}`;
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
    const spy = vitest.fn((a) => a);
    const task = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
    });

    const { app } = getApp();
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

  it('Migrate cache (+ check meta after)', async () => {
    const spy = vitest.fn((a) => a);
    const task = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
      meta: {
        version: 1,
      },
    });

    const { app, storage } = getApp();
    await app.run(task, 3);
    await app.run(task, 4);
    await app.run(task, 5);

    const taskV2 = makeTask(spy, {
      getCacheKey(input) {
        return `input:${input}`;
      },
      onPostLoad(item) {
        // Invalidate
        if (item.result === 4) {
          return null;
        }
        if (item.result === 5) {
          // migrate
          return 12;
        }
        return item.result;
      },
      meta: {
        version: 2,
      },
    });

    await app.run(taskV2, 3);
    await app.run(taskV2, 4);
    await app.run(taskV2, 5);

    const data = storage.getData();

    expect(data).toHaveProperty('input:3');
    const three = data['input:3'];
    expect(three).toHaveProperty('result', 3);
    expect(three).toHaveProperty('meta.version', 1);

    expect(data).toHaveProperty('input:4');
    const four = data['input:4'];
    expect(four).toHaveProperty('result', 4);
    expect(four).toHaveProperty('meta.version', 2);

    expect(data).toHaveProperty('input:5');
    const five = data['input:5'];
    expect(five).toHaveProperty('result', 12);
    expect(five).toHaveProperty('meta.version', 2);
  });
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
