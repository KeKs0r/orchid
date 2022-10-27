import { ok } from 'assert';

import { NextApiRequest, NextApiResponse } from 'next';

import { repository } from '../../../lib/repository';

export default async function spanRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { spanId } = req.query;

  ok(typeof spanId === 'string', 'SpanId should be a string');
  const span = await repository.findSpanById(spanId);

  res.json({ span });
}
