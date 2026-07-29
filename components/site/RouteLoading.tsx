"use client";

import { usePathname } from "next/navigation";
import RouteLogoLoader from "@/components/site/RouteLogoLoader";

export default function RouteLoading() {
  const pathname = usePathname();
  return (
    <div className="route-loading-screen" role="status" aria-live="polite">
      <RouteLogoLoader pathname={pathname} persistent />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
