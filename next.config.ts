import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A single build directory prevents the development server from serving
  // stale route chunks after a page has been rebuilt or renamed.
  distDir: ".next",
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
