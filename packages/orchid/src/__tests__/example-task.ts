import { TaskSpec, TaskContext, SpecToTask } from '../task.types';

declare global {
  interface GlobalTasks {
    main: SpecToTask<typeof mainTask>;
    double: SpecToTask<typeof doubleTask>;
    list: SpecToTask<typeof listTask>;
    addOne: SpecToTask<typeof addOneTask>;
    sum: SpecToTask<typeof sumTask>;
  }
}

export const mainTask: TaskSpec<undefined, Promise<number>> = {
  name: 'main',
  async run(input: undefined, { run, log }: TaskContext) {
    const list = await run('list', 4);
    log.info('Successful List', list);
    return list;
  },
};

export type DoubleTask = SpecToTask<typeof doubleTask>;
export type ListTask = SpecToTask<typeof listTask>;

export const doubleTask: TaskSpec<number, Promise<number>, number[]> = {
  name: 'double',
  async run(input, ctx: TaskContext<number[]>) {
    // console.log('Task.run:double', input, 'parent', ctx.parent.name);
    if (ctx.parent.name !== 'list') {
      throw new Error('Double can only be called from list');
    }
    const listLength = ctx.parent.input.length;
    if (listLength > 6) {
      ctx.log.warn('log', 'List is too long, not doubling');
      return input;
    }
    return input * 2;
  },
};

export const listTask: TaskSpec<number, Promise<number>> = {
  name: 'list',
  async run(amount: number, ctx: TaskContext) {
    // console.log('Task.run List', amount, 'parent', ctx.parent.name);
    const list = new Array(amount).fill('').map((a, i) => i);
    const doubled = await Promise.all(
      list.map((number) => {
        if (number % 3 == 1) {
          return ctx.run('addOne', number);
        }
        return ctx.run('double', number);
      })
    );
    const sum = await ctx.run('sum', doubled);
    return sum;
  },
};

export const addOneTask: TaskSpec<number, number> = {
  name: 'addOne',
  run(amount: number) {
    return amount + 1;
  },
};

export const sumTask: TaskSpec<number[], Promise<number>> = {
  name: 'sum',
  async run(list: number[]) {
    return list.reduce((a, b) => a + b, 0);
  },
};

export const loggingTask: TaskSpec<string, boolean> = {
  name: 'log',
  run(input: string, ctx: TaskContext) {
    ctx.log.info(input);
    return true;
  },
};
