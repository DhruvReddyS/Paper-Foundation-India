import React from 'react';
export function Button({ children, ...props }: any) {
  return <div className="button-component" {...props}>{children || 'Button Component'}</div>;
}
