'use client';

import { ComponentProps } from 'react';

import { App } from '@orchid/inspector-ui';

export function AppLayout(props: ComponentProps<typeof App>) {
  return <App {...props} />;
}
