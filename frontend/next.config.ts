import type { NextConfig } from "next";

// Laravel backend (server-side address used by the proxy below).
// Use 127.0.0.1 rather than localhost: `php artisan serve` binds IPv4 only.
const LARAVEL_URL = process.env.LARAVEL_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // 90 keeps the jersey stripes and crest crisp; 75 (default) for everything else.
  images: { qualities: [75, 90] },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Same-origin proxy to Laravel. The browser talks to /backend/* on the Next.js
  // origin, so Laravel's session + XSRF-TOKEN cookies work without any CORS changes.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${LARAVEL_URL}/:path*` }];
  },
};

export default nextConfig;
