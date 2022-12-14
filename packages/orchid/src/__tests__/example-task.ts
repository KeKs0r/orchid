import { TaskContext, TaskSpec } from '../model/task.types';

export const mainTask: TaskSpec<undefined, Promise<number>> = {
  name: 'main',
  async run(input: undefined, { run, log }) {
    const list = run(listTask, 4);
    log.info('Successful List', list);
    return list;
  },
};

export const listTask = {
  name: 'list',
  async run(amount: number, { run }: TaskContext): Promise<number> {
    const list = Array.from({ length: amount }).map((a, i) => i);
    const doubled = await Promise.all(
      list.map((number) => {
        if (number % 3 == 1) {
          return run(addOneTask, number);
        }
        return run(doubleTask, number);
      })
    );
    const sum = await run(sumTask, doubled);
    return sum;
  },
};

export const doubleTask: TaskSpec<number, Promise<number>> = {
  name: 'double',
  async run(input, { log, parent }) {
    if (parent?.task.name !== 'list') {
      throw new Error('Double can only be called from list');
    }

    if (parent && Array.isArray(parent.input) && parent.input.length > 6) {
      log.warn('log', 'List is too long, not doubling');
      return input;
    }
    return input * 2;
  },
};

export const addOneTask: TaskSpec<number, number> = {
  name: 'addOne',
  run(amount: number) {
    return amount + 1;
  },
};

export function sumTask(list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}
