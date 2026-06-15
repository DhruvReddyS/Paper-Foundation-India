import React from 'react';
export function Tabs({ children, ...props }: any) {
  return <div className="tabs-component" {...props}>{children || 'Tabs Component'}</div>;
}
