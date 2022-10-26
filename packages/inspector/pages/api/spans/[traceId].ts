import { NextApiRequest, NextApiResponse } from 'next';

import { findSpansByTraceId } from '@orchid/storage-nedb';

export default async function spanRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { traceId } = req.query;

  const spans = await findSpansByTraceId(traceId);

  res.json({ spans });
}
