import { TaskSpec, TaskContext } from '../task.types';
import { Next, PluginDefinition } from '../plugin.types';

// function makePlugin({ threshold }: { threshold: number }): PluginDefinition {
//   const plugin: PluginDefinition = {
//     name: 'array-log',
//     middleware: async (
//       input: unknown,
//       context: TaskContext,
//       next: Next<TaskContext>
//     ) => {
//       if (Array.isArray(input) && input.length > threshold) {
//         context.log.debug('Array Input', input.length);
//       }
//       const result = await next(input, context);
//       if (Array.isArray(result) && result.length > threshold) {
//         context.log.debug('Array Result', result.length);
//       }
//       return result;
//     },
//   };
//   return plugin;
// }

export const mainTask = {
  name: 'main',
  async run(input: unknown, { run, log }: TaskContext) {
    const list = await run('list', 4);
    log.info('Successful List', list);
    return list;
  },
};

export const doubleTask: TaskSpec<any, any, number[]> = {
  name: 'double',
  async run(input: number, ctx: TaskContext<number[]>) {
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

export const listTask: TaskSpec = {
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
