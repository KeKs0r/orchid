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

export type TaskContext<ParentInputType = any> = {
  log: Logger;
  /**
   * The definition in the TaskSpec is sync, but
   */
  run: (name: string, input: any) => Promise<any>;
  parent: Parent<ParentInputType>;
};

type Parent<InputType> = {
  name: string;
  input: InputType;
};
