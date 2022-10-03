import { makeApp } from '../app';
import {
  addOneTask,
  doubleTask,
  listTask,
  mainTask,
  sumTask,
} from './example-task';
import { makeExampleMiddleware } from './example-middleware';

describe('Tasks', () => {
  const app = makeApp();
  it('Can run single task', async () => {
    const res = await app.run(addOneTask, 3);
    expect(res).toEqual(4);
  });

  it('Parent Context is set (can call double only from list)', async () => {
    await expect(app.run(doubleTask, 3)).rejects.toThrow(
      'Double can only be called from list'
    );
    const listResult = await app.run(listTask, 3);
    expect(listResult).toEqual(6);
  });
  it('Can run Everything', async () => {
    /*
     * @TODO: This does not pass typescript if undefined is not explicitly passed
     */
    const res = await app.run(mainTask, undefined);
    expect(res).toEqual(12);
  });
  it('Can directly run Task Functions', async () => {
    const sum = await app.run(sumTask, [1, 2, 3, 4, 5]);
    expect(sum).toEqual(15);
  });
});

describe('Middleware', () => {
  it('Runs middleware on individual task', async () => {
    const preSpy = vi.fn();
    const postSpy = vi.fn();

    const app = makeApp();
    app.use(
      makeExampleMiddleware({
        onPreTask: preSpy,
        onPostTask: postSpy,
      })
    );

    const result = await app.run(addOneTask, 3);
    expect(result).toEqual(4);
    expect(preSpy).toHaveBeenCalledOnce();
    expect(preSpy).toHaveBeenCalledWith(expect.anything(), 3);
    expect(postSpy).toHaveBeenCalledOnce();
    expect(postSpy).toHaveBeenCalledWith(expect.anything(), 4);
  });

  it('Runs middleware on every task', async () => {
    const preSpy = vi.fn();
    const postSpy = vi.fn();

    const app = makeApp();
    app.use(
      makeExampleMiddleware({
        onPreTask: preSpy,
        onPostTask: postSpy,
      })
    );

    await app.run(listTask, 4);
    const expectCallCounts = {
      list: 1,
      double: 3,
      addOne: 1,
      sum: 1,
    };
    const totalCount = Object.values(expectCallCounts).reduce(
      (a, b) => a + b,
      0
    );
    expect(preSpy).toHaveBeenCalledTimes(totalCount);
    expect(postSpy).toHaveBeenCalledTimes(totalCount);
  });
});
