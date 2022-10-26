'use client';
import { ok } from 'assert';

import React, { createContext, useContext, useMemo, useState } from 'react';

import { SpanItem } from '../model/SpanItem';
import { flattenTree, Trace } from '../model/tree-model';

interface TraceContextProps {
  trace: Trace;
  selectedSpan: SpanItem;
  setSelectedSpanId: React.Dispatch<React.SetStateAction<string>>;
}

export const TraceContext = createContext<TraceContextProps | null>(null);

interface TraceContextProviderProps {
  children: React.ReactNode;
  trace: Trace;
}

export function TraceContextProvider({
  trace,
  children,
}: TraceContextProviderProps) {
  const [selectedSpanId, setSelectedSpanId] = useState(trace.root.id);
  const spansById = useMemo(() => {
    return Object.fromEntries(flattenTree(trace.root).map((t) => [t.id, t]));
  }, [trace]);
  const selectedSpan = spansById[selectedSpanId];

  return (
    <TraceContext.Provider
      value={{
        trace,
        selectedSpan,
        setSelectedSpanId,
      }}
    >
      {children}
    </TraceContext.Provider>
  );
}

export function useTraceContext() {
  const ctx = useContext(TraceContext);
  ok(ctx, 'missing TraceContext. Call Provider');
  return ctx;
}
