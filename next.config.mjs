/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["agentic-8131f272.vercel.app"]
    }
  }
};

export default nextConfig;
