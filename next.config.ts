import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // three.js and the R3F ecosystem ship untranspiled ESM; transpiling them here
  // keeps the server bundle from tripping over browser-only globals during SSR.
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
