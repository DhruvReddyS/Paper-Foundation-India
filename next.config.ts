import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep development chunks separate from production builds. Running
  // `next build` while a dev server is open must not replace the CSS/JS files
  // that the browser is currently requesting.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
