import { assert } from '@orchid/util';
import { Logger, TaskContext, TaskSpec } from './task.types';

export function makeApp(tasks: TaskSpec<any, any, any>[]) {
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
    input: any,
    context: Omit<TaskContext, 'run'>
  ): Promise<any> {
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
      run: (name: string, input: any) => run(name, input, nextContext),
    });
  }
  return {
    run: (name: string, input?: any) =>
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
