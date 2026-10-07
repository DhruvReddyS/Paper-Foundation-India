import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Paper Foundation India", short_name: "PFI", description: "Evidence-led public understanding of paper, fibre and recovery.", start_url: "/", display: "standalone", background_color: "#f3efe6", theme_color: "#173b29", icons: [{ src: "/images/brand/paper-foundation-nav-logo.png", sizes: "any", type: "image/png" }] };
}
