import { Breadcrumbs, Link, Typography } from '@mui/material';

import { SpanItem } from '../../model/SpanItem';
import { getBreadcrumbs } from '../../model/tree-model';
import { useTraceContext } from '../TraceContext';

export function SpanBreadcrumbs({ span }: { span: SpanItem }) {
  const { setSelectedSpanId } = useTraceContext();
  const crumbs = getBreadcrumbs(span);
  return (
    <Breadcrumbs>
      {crumbs.map((c) => {
        if (c.id === span.id) {
          return <Typography key={c.id}>{c.name}</Typography>;
        }
        return (
          <Link
            key={c.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedSpanId(c.id);
            }}
          >
            {c.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
