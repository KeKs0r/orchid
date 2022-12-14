import TreeView from '@mui/lab/TreeView';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import TreeItem from '@mui/lab/TreeItem';

import { useTraceContext } from './TraceContext';
import { SpanItem } from '../model/SpanItem';
import { getStatus } from '../model/span-model';
import clsx from 'clsx';

export interface SpanTreeProps {
  root: SpanItem;
}

export function SpanTree({ root }: SpanTreeProps) {
  const { setSelectedSpanId, selectedSpan } = useTraceContext();
  function onNodeSelect(event: unknown, id: string) {
    setSelectedSpanId(id);
  }
  return (
    <TreeView
      defaultCollapseIcon={<ChevronDownIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onNodeSelect}
      selected={selectedSpan.id}
    >
      <SpanTreeItem item={root} />
    </TreeView>
  );
}

interface SpanTreeItemProps {
  item: SpanItem;
}

export function SpanTreeItem({ item }: SpanTreeItemProps) {
  const status = getStatus(item);
  return (
    <TreeItem
      nodeId={item.id}
      label={item.name}
      className={clsx({
        'text-red-500': status === 'error',
        'text-yellow-500': status === 'warn',
      })}
    >
      {item.children.length > 0 && (
        <>
          {item.children.map((child) => (
            <SpanTreeItem item={child} key={child.id} />
          ))}
        </>
      )}
    </TreeItem>
  );
}
