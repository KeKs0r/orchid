import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import { repository } from '../lib/repository';

export default function Index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <ul>
      {props.traceIds.map((id) => (
        <li key={id}>
          <Link href={`/traces/${id}`}>{id}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const spans = await repository.findALl();
  const traceIds = Array.from(new Set(spans.map((a) => a.traceId)));
  return {
    props: {
      traceIds,
    }, // will be passed to the page component as props
  };
}
