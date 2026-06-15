import React from 'react';
export function Accordion({ children, ...props }: any) {
  return <div className="accordion-component" {...props}>{children || 'Accordion Component'}</div>;
}
