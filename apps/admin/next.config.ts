import { NextConfig } from "next";

const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
} satisfies NextConfig;

export default nextConfig;
