import { makeApp } from '../app';
import {
  addOneTask,
  doubleTask,
  listTask,
  loggingTask,
  mainTask,
  sumTask,
  plugin,
} from './example-task';

describe('App', () => {
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
      expect(true).toEqual(false);
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
});
