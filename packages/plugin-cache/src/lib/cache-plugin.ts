import { GetOutput, Middleware, TaskContext } from 'orchid';
import { CacheResult, CacheStorage } from './cache.types';

declare global {
  interface TaskSpecExtension<
    Input,
    Output,
    Context extends TaskContext = TaskContext
  > {
    cache?: TaskCacheExtension<Input, Output, Context>;
  }
}

export interface TaskCacheExtension<
  Input,
  Output,
  Context extends TaskContext = TaskContext
> {
  getCacheKey(input: Input, context: Context): string;
  meta?: any;
  /**
   * Process Item loaded from cache.
   * Use Cases:
   * - deserialization
   * - cache invalidation
   * - cache migration
   */
  onPostLoad?: (
    item: CacheResult<any>,
    context: Context,
    input: Input
  ) => Output | null;
  /**
   * Process Item before storing into cache
   * Use Cases:
   * - serialization
   */
  onPreSave?: (result: Output) => any;
}

interface CachePluginOptions {
  storage: CacheStorage;
}

export function createCachePlugin(options: CachePluginOptions) {
  const middleware: Middleware = async (task, input, context, next) => {
    function save(value: any) {
      if (!task.cache) {
        return;
      }
      const cacheResult = task.cache.onPreSave
        ? task.cache.onPreSave(value)
        : value;
      const item = {
        meta: {
          createdDate: new Date().toISOString(),
          version: 1,
          ...task.cache.meta,
        },
        result: cacheResult,
      };
      return options.storage.save(key, item);
    }

    if (!task.cache) {
      return next(input, context);
    }
    const key = task.cache.getCacheKey(input, context);
    const cacheItem = await options.storage.load<GetOutput<typeof task>>(key);
    const processedCacheItem =
      cacheItem && task.cache.onPostLoad
        ? task.cache.onPostLoad(cacheItem, context, input)
        : cacheItem?.result;

    if (processedCacheItem) {
      const serialized = task.cache.onPreSave
        ? task.cache.onPreSave(processedCacheItem)
        : processedCacheItem.item;
      /**
       * If we processed the item, we might need to update the cache
       * TODO: This is not very optimized and is probably called too often
       */
      if (
        cacheItem?.result &&
        JSON.stringify(cacheItem.result) !== JSON.stringify(serialized)
      ) {
        await save(processedCacheItem);
      }
      return processedCacheItem;
    }
    const result = await next(input, context);
    await save(result);
    return result;
  };
  return middleware;
}
