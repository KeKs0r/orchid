import type { NextApiRequest, NextApiResponse } from 'next';
import type { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';

export default async function ingestApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Ingesting body:');
  const request = req.body as IExportTraceServiceRequest;
  console.log(JSON.stringify(request, null, 4));
  res.json({ ok: true });
}
