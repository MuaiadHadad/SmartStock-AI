import type { NextConfig } from "next";

// Allow switching basePath per environment: in dev, no basePath; in prod, set NEXT_BASE_PATH="/smartstock-frontend"
const envBasePath = process.env.NEXT_BASE_PATH;
const basePath = envBasePath && envBasePath.startsWith("/") ? envBasePath : undefined;

const nextConfig: NextConfig = {
  basePath,
  // Keep assets aligned when basePath is set
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
