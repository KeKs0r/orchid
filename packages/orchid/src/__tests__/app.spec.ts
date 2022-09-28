import { makeApp } from '../app';
import { addOneTask, doubleTask, listTask, mainTask } from './example-task';

describe('Tasks', () => {
  const app = makeApp();
  it('Can run single task', () => {
    const res = app.run(addOneTask, 3);
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
});
