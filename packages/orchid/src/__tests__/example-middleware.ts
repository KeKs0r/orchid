import { Middleware } from '../model/middleware.types';
import { TaskSpec } from '../model/task.types';

interface ExampleMiddlewareOptions {
  onPreTask?: (task: TaskSpec<any, any>, input: any) => void;
  onContext?: <T>(ctx: T) => T;
  onPostTask?: (task: TaskSpec<any, any>, result: any) => void;
}
export function makeExampleMiddleware(
  options: ExampleMiddlewareOptions
): Middleware {
  const exampleMiddleware: Middleware = async function exampleMiddleware(
    task,
    input,
    ctx,
    next
  ) {
    if (options.onPreTask) {
      options.onPreTask(task, input);
    }
    const context = options.onContext ? options.onContext(ctx) : ctx;
    const result = await next(input, context);
    if (options.onPostTask) {
      options.onPostTask(task, result);
    }
    return result;
  };

  return exampleMiddleware;
}
