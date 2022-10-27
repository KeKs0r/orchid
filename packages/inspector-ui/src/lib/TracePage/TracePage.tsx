import type { ISpan } from '@opentelemetry/otlp-transformer';

import { fromSerializedSpans } from '../model/tree-model';

import { TraceContextProvider } from './TraceContext';
import { TraceLayout } from './TraceLayout';
import { SpanTreeProps, SpanTree } from './SpanTree';
import { SpanDetails } from './SpanDetails/SpanDetails';

export function TracePage({ spans }: { spans: ISpan[] }) {
  const trace = fromSerializedSpans(spans);
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
