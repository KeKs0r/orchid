import { Card, CardHeader } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export interface JSONCardProps {
  json: any;
  title: string;
}

export function JSONCard({ json, title }: JSONCardProps) {
  return (
    <Card>
      <CardHeader title={title} />
      <JSONTree data={json} invertTheme />
    </Card>
  );
}
