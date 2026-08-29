import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This landing page has no server-only routes. Exporting it as static files
  // lets Vercel serve it directly instead of expecting the Cloudflare worker.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
