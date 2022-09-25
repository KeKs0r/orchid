declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalTasks {
    main: {
      input: undefined;
      output: Promise<number>;
    };
    list: {
      input: number;
      output: Promise<number>;
    };
  }
}

export type TaskSpec<Input = any, Output = any, ParentInputType = null> = {
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
type Runner = {
  [Name in keyof GlobalTasks]: (
    name: Name,
    input: GetTask<Name>['input']
  ) => GetTask<Name>['output'];
}[keyof GlobalTasks];

export type TaskContext<ParentInputType = any> = {
  log: Logger;
  /**
   * The definition in the TaskSpec is sync, but
   */
  run: Runner;
  parent: Parent<ParentInputType>;
};

type Parent<InputType> = {
  name: string;
  input: InputType;
};
