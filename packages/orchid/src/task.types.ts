export type TaskSpec<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> = TaskSpecObject<Input, Output, Context>;
//   | RunFn<Input, Output, Context>;

export interface TaskSpecObject<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> {
  id: string;
  run(input: Input, ctx: Context): Output;
}

export type TaskContext = {
  run<Task extends TaskSpec<unknown, unknown>>(
    task: Task,
    input: Parameters<Task['run']>[0]
  ): ReturnType<Task['run']>;
  parent?: {
    task: TaskSpec<unknown, unknown>;
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
