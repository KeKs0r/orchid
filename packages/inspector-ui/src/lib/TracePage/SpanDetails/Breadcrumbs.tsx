import { SpanItem } from '../../model/tree-model';

export function Breadcrumbs({ span }: { span: SpanItem }) {
  const crumbs = getNames(span);
  return crumbs.join(' - ');
}

function getNames(span: SpanItem): string[] {
  const before = span.parent ? getNames(span.parent) : [];
  return [...before, span.name];
}
