import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot, { TimelineDotProps } from '@mui/lab/TimelineDot';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import Typography from '@mui/material/Typography';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  EnvelopeIcon,
  ChartPieIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { Paper } from '@mui/material';
import React from 'react';

import { SpanItem } from '../../model/SpanItem';
import {
  TimelineItem as TimelineItemModel,
  getTimeline,
} from '../../model/timeline-model';
import { renderEventTime } from '../../util/date-formatter';

export function SpanTimeline({
  span,
  className,
}: {
  span: SpanItem;
  className?: string;
}) {
  const items = getTimeline(span);

  return (
    <Paper className={className}>
      <Timeline>
        {items.map((item, idx) => (
          <SpanTimelineItem item={item} key={idx} />
        ))}
      </Timeline>
    </Paper>
  );
}

interface SpanTimelineItemProps {
  item: TimelineItemModel;
}

type TimelineItemRenderProps = {
  icon: React.ReactNode;
  color: TimelineDotProps['color'];
  title: string;
  subtitle?: string;
};

function SpanTimelineItem({ item }: SpanTimelineItemProps) {
  const { color, icon, title, subtitle } = getRenderProps(item);
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        align="right"
        variant="body2"
        color="text.secondary"
      >
        {renderEventTime(item.timestamp)}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color={color}>{icon}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ m: 'auto 0' }}>
        <Typography variant="h6" component="span">
          {title}
        </Typography>
        {subtitle && <Typography>{subtitle}</Typography>}
      </TimelineContent>
    </TimelineItem>
  );
}

function getRenderProps(item: TimelineItemModel): TimelineItemRenderProps {
  switch (item.type) {
    case 'exception':
      return {
        icon: <FireIcon className="h-5 w-5" />,
        color: 'error',
        title: item.exception.type,
        subtitle: item.exception.message,
      };
    case 'start':
      return {
        icon: <ChevronDoubleRightIcon className="h-5 w-5" />,
        color: 'inherit',
        title: 'Start',
      };
    case 'end':
      return {
        icon: <ChevronDoubleLeftIcon className="h-5 w-5" />,
        color: 'inherit',
        title: 'End',
      };
    case 'child':
      return {
        icon: <LaptopMacIcon className="h-5 w-5" />,
        color: 'secondary',
        title: item.name,
      };
    case 'event':
      return {
        icon: <ChartPieIcon className="h-5 w-5" />,
        color: 'primary',
        title: item.name,
      };
    case 'log':
      return {
        icon: <EnvelopeIcon className="h-5 w-5" />,
        color: 'grey',
        title: '@TODO: Extract log Summary',
      };
  }
}
