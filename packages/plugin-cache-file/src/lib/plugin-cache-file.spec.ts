import fs from 'fs';
import { join } from 'path';

import { makeStorage } from './plugin-cache-file';

describe('@orchid/plugin-cache-file', () => {
  const fixturePath = join(__dirname, '__tests__', '.cache');
  const storage = makeStorage({
    basePath: fixturePath,
  });
  const meta = {
    createdDate: new Date().toISOString(),
    version: 1,
  };
  beforeAll(() => {
    fs.rmSync(fixturePath, { recursive: true, force: true });
  });
  it('Works with non existing directory', async () => {
    const result = storage.load('directory/not-existing:key');
    expect(result).toBeFalsy();
  });

  it('Works with non existing file', async () => {
    const result = storage.load('not-existing:key');
    expect(result).toBeFalsy();
  });

  it('Can write full file', async () => {
    storage.save('single-file', {
      result: { foo: 'bar' },
      meta,
    });
    const stored = await storage.load('single-file');
    expect(stored).toHaveProperty('result.foo', 'bar');
    expect(stored).toHaveProperty('meta.version', 1);
    expect(stored).toHaveProperty('meta.createdDate');
  });

  it('Can write item in file', async () => {
    storage.save('directory/multi-file:key1', {
      result: { foo: 'baz' },
      meta,
    });
    storage.save('directory/multi-file:key2', {
      result: { foo: 'baz2' },
      meta,
    });
    const k1 = await storage.load('directory/multi-file:key1');
    expect(k1).toHaveProperty('result.foo', 'baz');
    expect(k1).toHaveProperty('meta.version', 1);
    expect(k1).toHaveProperty('meta.createdDate');

    const k2 = await storage.load('directory/multi-file:key2');
    expect(k2).toHaveProperty('result.foo', 'baz2');
    expect(k2).toHaveProperty('meta.version', 1);
    expect(k2).toHaveProperty('meta.createdDate');
  });

  it('Can drop item in file', async () => {
    const key1 = 'directory/drop-multi-file:key1';
    const key2 = 'directory/drop-multi-file:key2';
    await Promise.all([
      storage.save(key1, {
        result: { foo: 'baz' },
        meta,
      }),
      storage.save(key2, {
        result: { foo: 'baz2' },
        meta,
      }),
    ]);

    const v1 = await storage.load(key1);
    const v2 = await storage.load(key2);
    expect(v1).toBeTruthy();
    expect(v2).toBeTruthy();
    await storage.drop(key1);

    const k1 = await storage.load(key1);
    const k2 = await storage.load(key2);
    expect(k1).toBeFalsy();
    expect(k2).toBeTruthy();
  });

  it('Can use url as key', async () => {
    const key = 'directory/url:https://www.google.com/';
    await storage.save(key, { result: { foo: 'google' }, meta });
    const r = await storage.load(key);
    expect(r).toHaveProperty('result.foo', 'google');
  });

  it('Can drop complete file', async () => {
    const key1 = 'directory/drop-file-1';
    const key2 = 'directory/drop-file-2';
    await Promise.all([
      storage.save(key1, {
        result: { foo: 'baz' },
        meta,
      }),
      storage.save(key2, {
        result: { foo: 'baz2' },
        meta,
      }),
    ]);

    const v1 = await storage.load(key1);
    const v2 = await storage.load(key2);
    expect(v1).toBeTruthy();
    expect(v2).toBeTruthy();
    await storage.drop(key1);

    const k1 = await storage.load(key1);
    const k2 = await storage.load(key2);
    expect(k1).toBeFalsy();
    expect(k2).toBeTruthy();
  });
});
