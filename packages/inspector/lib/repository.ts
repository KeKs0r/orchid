import { writeFileSync } from 'fs';
import { join } from 'path';

import { makeRepository } from '@orchid/storage-nedb';

const cachePath = join(process.cwd(), 'packages/inspector/data', 'spans.db');
export const repository = makeRepository({
  filename: cachePath,
  autoload: true,
});
