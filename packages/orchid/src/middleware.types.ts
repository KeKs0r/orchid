import { GetContext, GetInput, GetOutput, TaskSpecObject } from './task.types';

export type Next<Task extends TaskSpecObject<any, any>> = (
  input: GetInput<Task>,
  ctx: GetContext<Task>
) => Promise<GetOutput<Task>>;

export type Middleware = <Task extends TaskSpecObject<any, any>>(
  task: Task,
  input: GetInput<Task>,
  context: GetContext<Task>,
  next: Next<Task>
) => Promise<GetOutput<Task>>;
