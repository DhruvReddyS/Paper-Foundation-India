"use client";

import { X } from "lucide-react";

export default function AdminDrawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="admin-drawer-backdrop" onMouseDown={onClose}><section className="admin-drawer" onMouseDown={event => event.stopPropagation()}><header><div><p>TEAM WORKFLOW</p><h2>{title}</h2></div><button onClick={onClose} aria-label="Close panel"><X /></button></header>{children}</section></div>;
}
