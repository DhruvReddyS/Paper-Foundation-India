"use client";

import Image from "next/image";

type RouteTheme =
  | "home"
  | "knowledge"
  | "myths"
  | "journey"
  | "discover"
  | "paper"
  | "foundation"
  | "correspondence";

function routePresentation(pathname: string): { theme: RouteTheme; label: string; detail: string } {
  if (pathname === "/") return { theme: "home", label: "Opening the Foundation", detail: "Paper, evidence and public understanding" };
  if (pathname.startsWith("/knowledge")) return { theme: "knowledge", label: pathname === "/knowledge/featured" ? "Opening the featured shelf" : "Preparing the reading room", detail: "Long-form research and essential context" };
  if (pathname.startsWith("/myths")) return { theme: "myths", label: "Checking both sides", detail: "Claims, evidence and missing context" };
  if (pathname.startsWith("/journey")) return { theme: "journey", label: "Following the fibre", detail: "From landscape to recovery" };
  if (pathname.startsWith("/discover") || pathname === "/games") return { theme: "discover", label: "Preparing the experience", detail: "Interactive material literacy" };
  if (["/everyday-paper", "/india-map", "/india-snapshot", "/circularity"].some((route) => pathname.startsWith(route))) {
    return { theme: "paper", label: "Mapping the paper system", detail: "Materials, places and circular routes" };
  }
  if (["/contact", "/join", "/report"].some((route) => pathname.startsWith(route))) {
    return { theme: "correspondence", label: pathname.startsWith("/join") ? "Preparing your place" : pathname.startsWith("/report") ? "Opening the evidence desk" : "Opening correspondence", detail: "A direct line to the Foundation" };
  }
  return { theme: "foundation", label: "Opening the next chapter", detail: "Paper Foundation India" };
}

export default function RouteLogoLoader({ pathname, persistent = false }: { pathname: string; persistent?: boolean }) {
  const presentation = routePresentation(pathname);
  return (
    <div className={`route-logo-loader route-logo-theme-${presentation.theme} ${persistent ? "is-persistent" : ""}`}>
      <div className="route-logo-scene" aria-hidden="true">
        <span className="route-logo-paper route-logo-paper-back" />
        <span className="route-logo-paper route-logo-paper-front">
          <i /><i /><i />
        </span>
        <span className="route-logo-mark">
          <Image src="/images/brand/paper-foundation-nav-logo.png" alt="" width={70} height={86} priority />
        </span>
        <span className="route-logo-fold" />
      </div>
      <div className="route-logo-copy">
        <small>Paper Foundation India</small>
        <strong>{presentation.label}</strong>
        <span>{presentation.detail}</span>
      </div>
      <span className="route-logo-progress" aria-hidden="true"><i /></span>
    </div>
  );
}
