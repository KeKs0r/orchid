import type { Middleware, Next } from './model/middleware.types';
import type {
  TaskContext,
  TaskSpec,
  GetContext,
  GetInput,
  GetOutput,
  TaskSpecObject,
} from './model/task.types';
import { wrapToObject } from './model/task.types';
import type { Logger } from './model/logger.types';

type RunContext<Context extends TaskContext> = Omit<
  Context,
  'run' | 'setContext' | 'getContext'
> & { getContext?: (key: string) => any };

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
    context: RunContext<GetContext<Task>>
  ): Promise<GetOutput<Task>> => {
    const taskObject = wrapToObject(task);
    const parentInput = input;
    const baseNextContext: RunContext<TaskContext> = {
      ...context,
      parent: {
        task: taskObject,
        input: parentInput,
      },
    };

    const contextData: Record<string, any> = {};

    function setContext(key: string, value: any) {
      if (contextData[key]) {
        context.log.warn(
          `Trying to extend context with key '${key}', but it already exists`
        );
      }
      contextData[key] = value;
    }

    function getContext(key: string) {
      return contextData[key] || context.getContext?.(key);
    }

    const currentContext: GetContext<Task> = {
      ...context,
      setContext,
      getContext,
      run: <SubTask extends TaskSpec<unknown, unknown>>(
        task: SubTask,
        input: GetInput<SubTask>
      ): Promise<GetOutput<SubTask>> => {
        const combinedContext: RunContext<TaskContext> = {
          ...baseNextContext,
          getContext,
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
      const initalContext: RunContext<TaskContext> = {
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
