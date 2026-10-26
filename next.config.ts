import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On Vercel, do NOT use output: "standalone" — Vercel handles the build itself.
  // Keep "standalone" only for self-hosting (Railway, Render, Docker).
  // output: "standalone",

  // Serverless external packages — Prisma must be bundled as external
  // for Vercel's serverless functions to find it.
  serverExternalPackages: ["@prisma/client"],

  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
