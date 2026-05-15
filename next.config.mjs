const API_PROXY_BASE = (process.env.API_PROXY_BASE || "https://api.dnfm.kr").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.platform === "win32" ? undefined : "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_PROXY_BASE}/:path*` },
    ];
  },
};

export default nextConfig;
