import { GetOutput, Middleware, TaskContext } from 'orchid';
import { CacheResult, CacheStorage } from './cache.types';

declare global {
  interface TaskSpecExtension<
    Input,
    Output,
    Context extends TaskContext = TaskContext
  > {
    cache?: CacheTaskExtension<Input, Output, Context>;
  }
}

interface CacheTaskExtension<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> {
  getCacheKey(input: Input, context: Context): string;
  stillValid?: (
    input: Input,
    item: CacheResult<Output>,
    context: Context
  ) => boolean;
  version?: number;
  serialize?: <Serialized>(result: Output) => Serialized;
  deserialize?: <Serialized>(raw: Serialized) => Output;
}

interface CachePluginOptions {
  storage: CacheStorage;
}

export function createCachePlugin(options: CachePluginOptions) {
  const middleware: Middleware = async (task, input, context, next) => {
    if (!task.cache) {
      return next(input, context);
    }
    const key = task.cache.getCacheKey(input, context);
    const cacheItem = await options.storage.load<GetOutput<typeof task>>(key);
    if (
      cacheItem &&
      (!task.cache.stillValid ||
        task.cache.stillValid(input, cacheItem, context))
    ) {
      return cacheItem.result;
    }
    const result = await next(input, context);
    await options.storage.save(key, result);
    return result;
  };
  return middleware;
}
