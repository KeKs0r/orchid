import fs from 'fs';
import { dirname, join, normalize } from 'path';
import sanitize from 'sanitize-filename';
import type { CacheResult, CacheStorage } from '@orchid/plugin-cache';
import { ok } from 'assert';

interface StorageOptions {
  basePath: string;
}
export function makeStorage(options: StorageOptions): CacheStorage {
  const { basePath } = options;
  const existingFolders = new Set();
  ensurePath(basePath);

  function getFullPath(path: string) {
    const fullPath = normalize(join(basePath, path));
    ok(
      fullPath.startsWith(basePath),
      `${fullPath} does not seem to be in ${basePath}`
    );
    return fullPath;
  }

  function ensurePath(path: string) {
    if (existingFolders.has(path)) {
      return;
    }
    const fullPath = getFullPath(path);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    existingFolders.add(path);
  }

  function read(path: string) {
    const fullPath = normalize(join(basePath, path));
    ok(
      fullPath.startsWith(basePath),
      `${fullPath} does not seem to be in ${basePath}`
    );
    try {
      const data = fs.readFileSync(fullPath, 'utf-8');
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
  }

  function write(path: string, data: Record<string, any>) {
    const fullPath = getFullPath(path);
    ensurePath(dirname(fullPath));
    const serialized = JSON.stringify(data);
    fs.writeFileSync(fullPath, serialized);
  }

  return {
    load(key: string) {
      const { directory, field, path } = parseKey(key);
      ensurePath(directory);

      const data = read(path);

      if (data) {
        const fileData = data;
        if (field) {
          return fileData[field];
        }
        return fileData;
      }
    },
    save<T>(key: string, item: CacheResult<T>) {
      const { directory, field, path } = parseKey(key);
      ensurePath(directory);

      if (field) {
        const existingFileData: Record<string, CacheResult<unknown>> = read(
          path
        ) || {};

        const nextFileData = {
          ...existingFileData,
          [field]: item,
        };
        write(path, nextFileData);
      } else {
        write(path, item);
      }
    },
    drop(key: string) {
      const { field, path } = parseKey(key);
      if (field) {
        const data = read(path);
        if (data) {
          delete data[field];
          write(path, data);
        }
      } else {
        const fullPath = getFullPath(path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    },
  };
}

function parseKey(key: string) {
  const parts = key.split(':');
  const [path, field, ...rest] = parts;

  const fullField = [field, ...rest].join(':');

  const cleaned = path.split('/').map((folder) => sanitize(folder));

  const directory = cleaned.slice(0, cleaned.length - 1).join('/');
  const file = cleaned.slice(cleaned.length - 1, cleaned.length) + '.json';

  return {
    directory,
    file,
    path: join(directory, file),
    field: fullField,
  };
}
