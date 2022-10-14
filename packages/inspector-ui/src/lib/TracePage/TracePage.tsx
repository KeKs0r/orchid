import { TraceLayout } from './TraceLayout';

export function TracePage() {
  return <TraceLayout aside={<AsideBody />}>Body</TraceLayout>;
}

function AsideBody() {
  return <div>Aside</div>;
}
