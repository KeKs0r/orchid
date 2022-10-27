//nodemon --exec "yarn ts-node packages/inspector/repl/list-traces.repl.ts" -e ts
//yarn vite-node -c vite.config.ts  packages/inspector/repl/list-traces.repl.ts
import { repository } from '../lib/repository';

main();
export async function main() {
  const spans = await repository.findALl();
  console.log(spans.length);
  const traceIds = Array.from(new Set(spans.map((a) => a.traceId)));
  console.log(traceIds);
}
