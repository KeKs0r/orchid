import { Card, CardHeader, Avatar } from '@mui/material';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  FireIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { SpanItem } from '../../model/SpanItem';
import { getStatus, UISpanStatus } from '../../model/span-model';
import { renderDate, renderDuration } from '../../util/date-formatter';

/**
 * Information for Header
 * - Status (UI Status)
 * - Timing (start + duration)
 * - ?? status message
 */

export function SpanDetailsSummary({ span }: { span: SpanItem }) {
  const status = getStatus(span);
  return (
    <Card className="flex justify-between">
      <CardHeader
        title={span.name}
        avatar={<StatusAvatar status={status} />}
        subheader={span.status.message}
      ></CardHeader>
      <CardHeader
        title={renderDate(span.startTime)}
        subheader={renderDuration(span.duration)}
        avatar={
          <Avatar className="bg-transparent">
            <ClockIcon className="text-gray-300" />
          </Avatar>
        }
      ></CardHeader>
    </Card>
  );
}

function StatusAvatar({ status }: { status: UISpanStatus }) {
  switch (status) {
    case 'error':
      return (
        <Avatar className="bg-transparent">
          <FireIcon className="text-red-500" />
        </Avatar>
      );
    case 'warn':
      return (
        <Avatar className="bg-transparent">
          <InformationCircleIcon className="text-yellow-500" />
        </Avatar>
      );
    case 'success':
      return (
        <Avatar className="bg-transparent">
          <CheckCircleIcon className="text-green-500" />
        </Avatar>
      );
  }
}
