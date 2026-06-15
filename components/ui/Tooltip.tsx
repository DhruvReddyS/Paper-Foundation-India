import React from 'react';
export function Tooltip({ children, ...props }: any) {
  return <div className="tooltip-component" {...props}>{children || 'Tooltip Component'}</div>;
}
