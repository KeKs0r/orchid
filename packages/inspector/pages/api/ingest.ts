import type { NextApiRequest, NextApiResponse } from 'next';

export default async function ingestApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  res.json({ ok: true });
}
