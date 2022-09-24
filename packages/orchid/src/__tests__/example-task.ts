import { TaskSpec, TaskContext } from '../task.types';
import { PluginDefinition } from '../plugin.types';

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

export const mainTask: TaskSpec<never> = {
  name: 'main',
  async run(input, { run, log }: TaskContext) {
    const list = await run('list', 4);
    log.info('Successful List', list);
  },
};

export const doubleTask: TaskSpec<any, any, number[]> = {
  name: 'double',
  async run(input: number, ctx: TaskContext<number[]>) {
    if (ctx.parent.name !== 'list') {
      throw new Error('Double can only be called fom list');
    }
    const listLength = ctx.parent.input.length;
    if (listLength > 6) {
      ctx.log.warn('log', 'List is too long, not doubling');
      return input;
    }
    return input * 2;
  },
};

export const listTask: TaskSpec = {
  name: 'list',
  async run(amount: number, ctx: TaskContext) {
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

export const addOneTask: TaskSpec = {
  name: 'addOne',
  run(amount: number, ctx: TaskContext) {
    return amount + 1;
  },
};

export const sumTask: TaskSpec = {
  name: 'sum',
  async run(list: number[], ctx: TaskContext) {
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
