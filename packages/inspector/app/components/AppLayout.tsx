'use client';

import React, { ComponentProps, ReactNode, useState } from 'react';

// import { App } from '@orchid/inspector-ui';

// export function AppLayout(props: ComponentProps<typeof App>) {
export function AppLayout(props: { children: ReactNode }) {
  const me = '__ME__';
  const [state, setState] = useState();
  return <div className="bg-red-400">{props.children}</div>;
  // return <App {...props} />;
}
