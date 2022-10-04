import { Middleware, Next } from './middleware.types';
import {
  Logger,
  TaskContext,
  TaskSpec,
  GetContext,
  GetInput,
  GetOutput,
  wrapToObject,
  TaskSpecObject,
} from './task.types';

export function makeApp() {
  const middlewares: Middleware[] = [];

  const log = makeLogger();

  function use(middleware: Middleware) {
    middlewares.push(middleware);
  }

  const invoke = <Task extends TaskSpecObject<any, any>>(
    task: Task,
    input: GetInput<Task>,
    context: GetContext<Task>,
    middlewares: Middleware[]
  ): Promise<GetOutput<Task>> => {
    if (middlewares.length === 0) {
      return task.run(input, context);
    }
    const mw = middlewares[0];

    const next: Next<Task> = (
      nextInput: GetInput<Task>,
      nextContext: GetContext<Task>
    ) => invoke<Task>(task, nextInput, nextContext, middlewares.slice(1));

    return mw(task, input, context, next);
  };

  const run = async <Task extends TaskSpec<any, any>>(
    task: Task,
    input: GetInput<Task>,
    context: Omit<GetContext<Task>, 'run' | 'extendContext'>
  ): Promise<GetOutput<Task>> => {
    const taskObject = wrapToObject(task);
    const parentInput = input;
    const baseNextContext: Omit<TaskContext, 'run' | 'extendContext'> = {
      ...context,
      parent: {
        task: taskObject,
        input: parentInput,
      },
    };

    const nextContextExtension: Record<string, any> = {};

    function extendContext(key: string, value: any) {
      if (nextContextExtension[key]) {
        context.log.warn(
          `Trying to extend context with key '${key}', but it already exists`
        );
      }
      nextContextExtension[key] = value;
    }

    const currentContext: GetContext<Task> = {
      ...context,
      extendContext,
      run: <SubTask extends TaskSpec<unknown, unknown>>(
        task: SubTask,
        input: GetInput<SubTask>
      ): Promise<GetOutput<SubTask>> => {
        const combinedContext: Omit<TaskContext, 'run' | 'extendContext'> = {
          ...baseNextContext,
          ...nextContextExtension,
        };
        return run(task, input, combinedContext);
      },
    };
    const result: GetOutput<Task> = await invoke(
      taskObject,
      input,
      currentContext,
      middlewares
    );
    return result;
  };

  return {
    use,
    run: <Task extends TaskSpec<any, any>>(
      task: Task,
      input: GetInput<Task>
    ) => {
      const initalContext: Omit<TaskContext, 'run' | 'extendContext'> = {
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
