import { ok } from 'assert';

import { NextApiRequest, NextApiResponse } from 'next';

import { repository } from '../../../lib/repository';

export default async function spanRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { traceId } = req.query;

  ok(typeof traceId === 'string', 'Traceid should be a string');
  const spans = await repository.findSpansByTraceId(traceId);

  res.json({ spans });
}
