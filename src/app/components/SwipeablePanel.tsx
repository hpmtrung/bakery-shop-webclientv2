import React from 'react';

export interface SwipeablePanelProps {
  children?: React.ReactNode | React.ReactNode[];
  dir?: string;
  index: number;
  value: number;
}

export default function SwipeablePanel({ children, value, index, ...other }: SwipeablePanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}
