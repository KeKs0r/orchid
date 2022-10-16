import { Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { CheckIcon } from '@heroicons/react/24/outline';

import { SpanItem } from '../../model/tree-model';

/**
 * Information for Header
 * - Status (UI Status)
 * - Timing (start + duration)
 * - ?? status message
 */

export function SpanDetailsSummary({ span }: { span: SpanItem }) {
  return (
    <Card>
      <CardHeader title={span.name} avatar={<Avatar />}></CardHeader>
      <CardContent>Stuff</CardContent>
    </Card>
  );
}
