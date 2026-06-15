'use client';
import React from 'react';
import { TornEdge } from '../../../components/paper-ui/TornEdge';

export function TornEdgeTransition() {
  return (
    <TornEdge 
      direction="down" 
      fromColour="var(--paper-white)" 
      toColour="var(--paper-warm)" 
      intensity="strong" 
    />
  );
}
