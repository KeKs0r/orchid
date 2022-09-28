import {
  Logger,
  TaskContext,
  TaskSpec,
  GetContext,
  GetInput,
  GetOutput,
  wrapToObject,
} from './task.types';

export function makeApp() {
  const log = makeLogger();

  const run = <Task extends TaskSpec<any, any>>(
    task: Task,
    input: GetInput<Task>,
    context: Omit<GetContext<Task>, 'run'>
  ): GetOutput<Task> => {
    const taskObject = wrapToObject(task);
    const parentInput = input;
    const nextContext: Omit<TaskContext, 'run'> = {
      ...context,
      parent: {
        task: taskObject,
        input: parentInput,
      },
    };
    const currentContext: GetContext<Task> = {
      ...context,
      run: <SubTask extends TaskSpec<unknown, unknown>>(
        task: SubTask,
        input: GetInput<SubTask>
      ): GetOutput<SubTask> => run(task, input, nextContext),
    };
    const result: GetOutput<Task> = taskObject.run(input, currentContext);
    return result;
  };

  return {
    run: <Task extends TaskSpec<any, any>>(
      task: Task,
      input: GetInput<Task>
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
