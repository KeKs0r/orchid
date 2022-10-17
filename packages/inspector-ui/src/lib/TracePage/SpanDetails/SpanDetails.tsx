import { useTraceContext } from '../TraceContext';

import { SpanBreadcrumbs } from './Breadcrumbs';
import { JSONCard } from './JsonCard';
import { SpanDetailsSummary } from './SpanDetailsSummary';
import { SpanTimeline } from './SpanTimeline';

/**
 * Sections:
 * - Breadcrumbs
 * - Header
 * - Logs
 * - Attributes
 * - Exception
 * - Input/Output
 */

export function SpanDetails() {
  const { selectedSpan: span } = useTraceContext();

  const input =
    span.attributes['input'] && typeof span.attributes['input'] === 'string'
      ? JSON.parse(span.attributes['input'])
      : undefined;
  const output =
    span.attributes['output'] && typeof span.attributes['output'] === 'string'
      ? JSON.parse(span.attributes['output'])
      : undefined;

  return (
    <div className="p-4">
      <SpanBreadcrumbs span={span} />
      <SpanDetailsSummary span={span} />
      {input || output ? (
        <div className="grid grid-cols-2 mt-2">
          {input && <JSONCard title="Input" json={input} />}
          {output && <JSONCard title="Output" json={output} />}
        </div>
      ) : null}
      <div className="mt-4">
        <SpanTimeline span={span} />
      </div>
    </div>
  );
}
