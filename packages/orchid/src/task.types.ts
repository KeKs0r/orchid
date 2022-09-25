declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalTasks {}
}

export type TaskSpec<
  Input = unknown,
  Output = unknown,
  ParentInputType = null
> = {
  name: string;
  run(input: Input, context: TaskContext<ParentInputType>): Output;
};

export interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

type GetTask<Name extends keyof GlobalTasks> = {
  name: Name;
  input: GlobalTasks[Name]['input'];
  output: GlobalTasks[Name]['output'];
};
type AllRunner = {
  [Name in keyof GlobalTasks]: GetTask<Name>;
}[keyof GlobalTasks];

type Runner<Name extends AllRunner['name']> = (
  name: Name,
  input: GetTask<Name>['input']
) => GetTask<Name>['output'];

export type TaskContext<ParentInputType = unknown> = {
  log: Logger;
  /**
   * The definition in the TaskSpec is sync, but
   */
  run: Runner<AllRunner['name']>;
  parent: Parent<ParentInputType>;
};

type Parent<InputType> = {
  name: string;
  input: InputType;
};
