"use client";

import { useEffect, useState } from "react";

export function usePublicSettings() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  useEffect(() => {
    fetch("/api/site-content").then(response => response.json()).then(data => setSettings(data.settings ?? {})).catch(() => undefined);
  }, []);
  return settings;
}
