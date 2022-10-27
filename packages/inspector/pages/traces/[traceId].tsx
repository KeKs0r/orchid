import { ok } from 'assert';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { TracePage } from '@orchid/inspector-ui';

import { repository } from '../../lib/repository';

export default function TraceRoute(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { spans } = props;
  return <TracePage spans={spans} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { traceId } = context.params;
  ok(typeof traceId === 'string', 'Need TraceId');
  const spans = await repository.findSpansByTraceId(traceId);
  return {
    props: {
      spans,
    }, // will be passed to the page component as props
  };
}
