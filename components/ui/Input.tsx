import React from 'react';
export function Input({ children, ...props }: any) {
  return <div className="input-component" {...props}>{children || 'Input Component'}</div>;
}
