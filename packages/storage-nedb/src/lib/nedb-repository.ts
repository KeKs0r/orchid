import type { ISpan } from '@opentelemetry/otlp-transformer';
import Datastore from '@seald-io/nedb';

export function makeRepository(options: Datastore.DataStoreOptions) {
  const db = new Datastore<ISpan>(options);
  return {
    insert: (spans: ISpan[]) => insert(db, spans),
    findSpansByTraceId: (traceId: string) => findSpansByTraceId(db, traceId),
  };
}

export async function insert(db: Datastore, spans: ISpan[]) {
  return db.insertAsync(spans);
}

export async function findSpansByTraceId(db: Datastore, traceId: string) {
  return db.findAsync({ traceId });
}
