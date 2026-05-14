/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.platform === "win32" ? undefined : "standalone",
  poweredByHeader: false,
  productionBrowserSourceMaps: true
};

export default nextConfig;
