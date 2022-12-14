import { Logger } from './logger.types';

export type TaskSpec<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> = TaskSpecObject<Input, Output, Context> | RunFn<Input, Output, Context>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TaskContextExtension {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TaskSpecExtension<
    Input,
    Output,
    Context extends TaskContext = TaskContext
  > {}
}

type RunFn<Input, Output, Context = TaskContext> = (
  input: Input,
  ctx: Context
) => Promise<Output> | Output;
export interface TaskSpecObject<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> extends TaskSpecExtension<Input, Output, Context> {
  name: string;
  run(input: Input, ctx: Context): Promise<Output> | Output;
}

export const wrapToObject = <Input, Output>(
  task: TaskSpec<Input, Output>
): TaskSpecObject<Input, Output> => {
  if (typeof task === 'function') {
    return {
      name: task.name || 'anon',
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
  ): Promise<GetOutput<Task>>;
  setContext(key: string, value: any): void;
  getContext(key: string): any;
  log: Logger;
  parent?: {
    task: TaskSpecObject<unknown, Promise<unknown>>;
    input: unknown;
  };
} & TaskContextExtension;
