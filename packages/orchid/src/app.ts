import { Logger, TaskContext, TaskSpec } from './task.types';

export function makeApp() {
  const log = makeLogger();

  const run = <Task extends TaskSpec<any, any>>(
    task: Task,
    input: Parameters<Task['run']>[0],
    context: Omit<Parameters<Task['run']>[1], 'run'>
  ): ReturnType<Task['run']> => {
    const parentInput = input;
    const nextContext: Omit<TaskContext, 'run'> = {
      ...context,
      parent: {
        task,
        input: parentInput,
      },
    };
    const currentContext: Parameters<Task['run']>[1] = {
      ...context,
      run: <SubTask extends TaskSpec<unknown, unknown>>(
        task: SubTask,
        input: Parameters<SubTask['run']>[0]
      ): ReturnType<SubTask['run']> => run(task, input, nextContext),
    };
    const result: ReturnType<Task['run']> = task.run(input, currentContext);
    return result;
  };

  return {
    run: <Task extends TaskSpec<any, any>>(
      task: Task,
      input: Parameters<Task['run']>[0]
    ) => {
      const initalContext: Omit<TaskContext, 'run'> = {
        log,
      };
      return run(task, input, initalContext);
    },
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
