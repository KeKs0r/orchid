// import { describe, it, expect } from 'vitest';

import { makeApp } from '../app';
import {
  addOneTask,
  doubleTask,
  listTask,
  loggingTask,
  mainTask,
  sumTask,
} from './example-task';

describe('App', () => {
  it('something', () => {
    console.log('Great');
    expect('great').toEqual('great');
  });
  const app = makeApp([
    addOneTask,
    doubleTask,
    listTask,
    loggingTask,
    mainTask,
    sumTask,
  ]);

  describe('Tasks', () => {
    it('Can run single task', async () => {
      const miniApp = makeApp([addOneTask]);
      const res = await miniApp.run('addOne', 3);
      expect(res).toEqual(4);
    });

    it('Parent Context is set (can call double only from list)', async () => {
      await expect(app.run('double', 3)).rejects.toThrow(
        'Double can only be called from list'
      );
      const listResult = await app.run('list', 3);
      expect(listResult).toEqual(6);
    });
    it('Can run Everything', async () => {
      const res = await app.run('main');
      expect(res).toEqual(12);
    });
  });

  // describe('Middleware', () => {});
});
