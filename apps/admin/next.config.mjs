/* eslint-disable no-param-reassign */
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];

    return config;
  },
};

export default nextConfig;
