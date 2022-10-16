import { useTraceContext } from '../TraceContext';
import { Breadcrumbs } from './Breadcrumbs';
import { SpanDetailsSummary } from './SpanDetailsSummary';

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

  return (
    <div className="p-4">
      <Breadcrumbs span={span} />
      <SpanDetailsSummary span={span} />
    </div>
  );
}
