import { assert } from '@orchid/util';
import { Logger, TaskContext, TaskSpec } from './task.types';

export function makeApp(tasks: TaskSpec<unknown, unknown, unknown>[]) {
  const tasksByName = Object.fromEntries(
    tasks.map((task) => [task.name, task])
  );
  assert(
    !tasksByName['root'],
    `'root' is a reserved task name for the root context. The name 'main' is preffered for your entry point`
  );

  const log = makeLogger();

  async function run(
    name: string,
    input: unknown,
    context: Omit<TaskContext, 'run'>
  ): Promise<unknown> {
    // console.log('App.run', name, 'input', input);
    const task = tasksByName[name];
    assert(task, `Could not find task definition for task '${name}'`);
    const parentInput = input;
    const nextContext = {
      ...context,
      parent: {
        name,
        input: parentInput,
      },
    };
    return task.run(input, {
      ...context,
      run: (name: string, input: unknown) => run(name, input, nextContext),
    } as TaskContext);
  }
  return {
    run: (name: string, input?: unknown) =>
      run(name, input, {
        log,
        parent: { name: 'root', input: null },
      }),
  };
}

function makeLogger(): Logger {
  return {
    debug(...args) {
      console.debug(...args);
    },
    info(...args) {
      console.info(...args);
    },
    error(...args) {
      console.error(...args);
    },
    warn(...args) {
      console.warn(...args);
    },
  };
}
