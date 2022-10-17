import { TraceContextProvider } from './TraceContext';
import { TraceLayout } from './MUITraceLayout';
import { data } from '../../data';
import { SpanTreeProps, SpanTree } from './SpanTree';
import { toTrace } from '../model/tree-model';
import { SpanDetails } from './SpanDetails/SpanDetails';

export function TracePage() {
  const trace = toTrace(data);
  return (
    <TraceContextProvider trace={trace}>
      <TraceLayout aside={<AsideBody root={trace.root} />}>
        <SpanDetails />
      </TraceLayout>
    </TraceContextProvider>
  );
}

function AsideBody({ root }: SpanTreeProps) {
  return <SpanTree root={root} />;
}
