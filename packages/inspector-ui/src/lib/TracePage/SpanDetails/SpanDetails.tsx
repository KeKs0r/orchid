import { useTraceContext } from '../TraceContext';
import { SpanBreadcrumbs } from './Breadcrumbs';
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
      <SpanBreadcrumbs span={span} />
      <SpanDetailsSummary span={span} />
    </div>
  );
}
