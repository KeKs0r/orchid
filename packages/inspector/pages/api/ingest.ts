import type { NextApiRequest, NextApiResponse } from 'next';
import type { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';

import { repository } from '../../lib/repository';

export default async function ingestApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const request = req.body as IExportTraceServiceRequest;

  const spans = request.resourceSpans.flatMap((resourceSpan) =>
    resourceSpan.scopeSpans.flatMap((scopeSpan) => scopeSpan.spans)
  );
  const traceId = [...new Set([...spans.map((a) => a.traceId)])];
  console.log('Ingested Traces', traceId);

  await repository.insert(spans);

  res.json({ ok: true });
}
