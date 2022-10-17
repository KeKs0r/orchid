import { join } from 'path';
import { mkdirSync, rmSync } from 'fs';

import { makeApp, TaskContext, TaskSpec } from 'orchid';
import { makeStorage } from '@orchid/plugin-cache-file';
import {
  TaskCacheExtension,
  createCachePlugin,
  CacheResult,
} from '@orchid/plugin-cache';

import { listTask, getListTask, List } from '../example-task';

const getList: TaskSpec<number, List, TaskContext> = {
  ...getListTask,
  cache: {
    getCacheKey(input) {
      return `list:${input}`;
    },
    meta: {
      version: 1,
    },
    onPreSave(list: List): number {
      return list.getList().length;
    },
    onPostLoad(item: CacheResult<number>) {
      return new List(item.result);
    },
  },
};

const newGetList: TaskSpec<number, List> = {
  ...getList,
  run(length: number) {
    return new List(length * 2);
  },
  cache: {
    ...getList.cache,
    meta: {
      version: 2,
    },
  } as TaskCacheExtension<number, List>,
};

const invalidatedNewGetList: TaskSpec<number, List> = {
  ...newGetList,
  cache: <TaskCacheExtension<number, List>>{
    ...newGetList.cache,
    onPostLoad(item) {
      if (item.meta.version >= 2) {
        return new List(item.result);
      }
      return null;
    },
  },
};

describe('E2E tests', () => {
  const basePath = join(__dirname, '.cache');
  const cacheStorage = makeStorage({
    basePath,
  });
  const app = makeApp();
  app.use(
    createCachePlugin({
      storage: cacheStorage,
    })
  );

  beforeEach(() => {
    rmSync(basePath, { recursive: true, force: true });
    mkdirSync(basePath);
  });

  it('Can run full process without cached tasks', async () => {
    const r = await app.run(listTask, new List(4));
    expect(r).toEqual(12);
  });

  it('Can run process with cached task (serialize / deserialize)', async () => {
    const r = await app.run(getList, 4);
    expect(r).toBeInstanceOf(List);

    const cachedR = await app.run(getList, 4);
    expect(cachedR).toBeInstanceOf(List);
  });

  it('Can ignore cached previous versions', async () => {
    const r = await app.run(getList, 4);
    expect(r).toBeInstanceOf(List);

    // This is not the new version, so length should still be 4
    const cachedR = await app.run(newGetList, 4);
    expect(cachedR).toBeInstanceOf(List);
    expect(cachedR.getList()).toHaveLength(4);

    // This is new version where result is invalidated
    const cachedR2 = await app.run(invalidatedNewGetList, 4);
    expect(cachedR2).toBeInstanceOf(List);
    expect(cachedR2.getList()).toHaveLength(8);
  });

  it('Can manually upgrade result', async () => {
    const r = await app.run(getList, 4);
    expect(r).toBeInstanceOf(List);

    // This is not the new version, so length should still be 4
    const cachedR = await app.run(newGetList, 4);
    expect(cachedR).toBeInstanceOf(List);
    expect(cachedR.getList()).toHaveLength(4);

    const spy = vitest.fn();

    const upgradedGetList: TaskSpec<number, List> = {
      ...invalidatedNewGetList,
      cache: <TaskCacheExtension<number, List>>{
        ...invalidatedNewGetList.cache,
        onPostLoad(item, context, input) {
          spy(item.result);
          if (item.result === input) {
            return new List(input * 2);
          }
          return new List(item.result);
        },
      },
    };

    // This is new version where result is invalidated
    const cachedR2 = await app.run(upgradedGetList, 4);
    expect(cachedR2).toBeInstanceOf(List);
    expect(cachedR2.getList()).toHaveLength(8);

    // Check that the cachse was actually wrong
    expect(spy).toHaveBeenLastCalledWith(4);

    const cachedR3 = await app.run(upgradedGetList, 4);
    expect(cachedR3).toBeInstanceOf(List);
    expect(cachedR3.getList()).toHaveLength(8);
    expect(spy).toHaveBeenLastCalledWith(8);
  });
});
