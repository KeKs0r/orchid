import type { ISpan } from '@opentelemetry/otlp-transformer';
import Datastore from '@seald-io/nedb';

export function makeRepository(options: Datastore.DataStoreOptions) {
  const db = new Datastore<ISpan>(options);
  return {
    insert: (spans: ISpan[]) => insert(db, spans),
    findSpansByTraceId: (traceId: string) => findSpansByTraceId(db, traceId),
    findSpanById: (spanId: string) => findSpanById(db, spanId),
    findALl: () => findAll(db),
  };
}

export async function insert(db: Datastore, spans: ISpan[]) {
  return db.insertAsync(spans);
}

export async function findSpansByTraceId(db: Datastore, traceId: string) {
  return db.findAsync({ traceId });
}

export async function findSpanById(db: Datastore, spanId: string) {
  return db.findOneAsync({ spanId });
}

export async function findAll(db: Datastore) {
  return db.findAsync({});
}
