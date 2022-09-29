export type TaskSpec<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> = TaskSpecObject<Input, Output, Context> | RunFn<Input, Output, Context>;

type RunFn<Input, Output, Context = TaskContext> = (
  input: Input,
  ctx: Context
) => Output;
export interface TaskSpecObject<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> {
  name: string;
  run(input: Input, ctx: Context): Output;
}

export const wrapToObject = <Input, Output>(
  task: TaskSpec<Input, Output>
): TaskSpecObject<Input, Output> => {
  if (typeof task === 'function') {
    return {
      name: task.name,
      run: task,
    };
  }
  return task;
};

export type GetRunner<Spec extends TaskSpec<any, any>> =
  Spec extends TaskSpecObject<any, any>
    ? Spec['run']
    : Spec extends RunFn<any, any>
    ? Spec
    : never;

export type GetInput<Spec extends TaskSpec<any, any>> = Parameters<
  GetRunner<Spec>
>[0];
export type GetContext<Spec extends TaskSpec<any, any>> = Parameters<
  GetRunner<Spec>
>[1];
export type GetOutput<Spec extends TaskSpec<any, any>> = ReturnType<
  GetRunner<Spec>
>;

export type TaskContext = {
  run<Task extends TaskSpec<any, any>>(
    task: Task,
    input: GetInput<Task>
  ): GetOutput<Task>;
  parent?: {
    task: TaskSpecObject<unknown, unknown>;
    input: unknown;
  };
  log: Logger;
};

export interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}
