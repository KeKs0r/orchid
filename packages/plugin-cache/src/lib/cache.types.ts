export interface CacheStorage {
  save<T>(key: string, value: CacheResult<T>): Promise<void> | void;
  load<T>(key: string): Promise<CacheResult<T> | null> | CacheResult<T> | null;
}

export interface CacheItemMeta {
  createdDate: string;
  version: number;
}

export interface CacheResult<T> {
  meta: CacheItemMeta;
  result: T;
}
