import React from 'react';
export function Badge({ children, ...props }: any) {
  return <div className="badge-component" {...props}>{children || 'Badge Component'}</div>;
}
