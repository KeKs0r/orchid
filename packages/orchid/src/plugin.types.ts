import { TaskContext, TaskSpec } from './task.types';

type Next<Context> = (input: any, ctx: Context) => any;

export type PluginDefinition<
  PluginOptions = any,
  Context extends TaskContext = TaskContext
> = {
  name: string;
  middleware: PluginMiddleWare<PluginOptions, Context>;
};

export type PluginMiddleWare<
  PluginOptions = any,
  Context extends TaskContext = TaskContext
> = (
  options: PluginOptions,
  task: TaskSpec
) => (input: any, context: Context, next: Next<Context>) => any;
