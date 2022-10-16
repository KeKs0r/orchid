import { TraceContextProvider } from './TraceContext';
import { TraceLayout } from './TraceLayout';
import { data } from '../../data';
import { SpanTreeProps, SpanTree } from './SpanTree';
import { toTrace } from '../model/tree-model';

export function TracePage() {
  const trace = toTrace(data);
  return (
    <TraceContextProvider trace={trace}>
      <TraceLayout aside={<AsideBody root={trace.root} />}>Body</TraceLayout>
    </TraceContextProvider>
  );
}

function AsideBody({ root }: SpanTreeProps) {
  return <SpanTree root={root} />;
}
