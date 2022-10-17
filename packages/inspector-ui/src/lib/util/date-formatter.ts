import { InterestsRounded } from '@mui/icons-material';
import { parseISO } from 'date-fns';

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function renderDate(date: string | number) {
  const asDate =
    typeof date === 'number' ? new Date(date / 1000) : parseISO(date);
  console.log(asDate);
  return dateFormatter.format(asDate);
}

export function renderDuration(ms: number) {
  return `${ms} ms`;
}

const eventTimeFormatter = new Intl.DateTimeFormat('en-US', {
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3,
} as any);

export function renderEventTime(timestamp: number) {
  const date = new Date(timestamp);
  return eventTimeFormatter.format(date);
}
