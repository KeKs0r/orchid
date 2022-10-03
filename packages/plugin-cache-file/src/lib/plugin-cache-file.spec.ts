import fs from 'fs';
import { join } from 'path';
import { makeStorage } from './plugin-cache-file';

describe('@orchid/plugin-cache-file', () => {
  const fixturePath = join(__dirname, '__tests__', '.cache');
  const storage = makeStorage({
    basePath: fixturePath,
  });
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
      meta: {
        createdDate: new Date().toISOString(),
        version: 1,
      },
    });
    const stored = await storage.load('single-file');
    expect(stored).toHaveProperty('result.foo', 'bar');
    expect(stored).toHaveProperty('meta.version', 1);
    expect(stored).toHaveProperty('meta.createdDate');
  });

  it('Can write item in file', async () => {
    const meta = {
      createdDate: new Date().toISOString(),
      version: 1,
    };
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
});
