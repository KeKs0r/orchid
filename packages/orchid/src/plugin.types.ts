import { TaskContext, TaskSpec } from './task.types';

export type Next<Context extends TaskContext = TaskContext> = (
  input: unknown,
  ctx: Context
) => Promise<unknown>;

export type PluginDefinition<Context extends TaskContext = TaskContext> = {
  name: string;
  middleware: PluginMiddleWare<Context>;
};

export type PluginMiddleWare<Context extends TaskContext = TaskContext> = (
  task: TaskSpec<unknown, unknown>
) => (
  input: unknown,
  context: Context,
  next: Next<Context>
) => Promise<unknown>;
