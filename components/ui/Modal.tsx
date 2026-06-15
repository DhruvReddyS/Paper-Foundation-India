import React from 'react';
export function Modal({ children, ...props }: any) {
  return <div className="modal-component" {...props}>{children || 'Modal Component'}</div>;
}
