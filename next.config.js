/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "api.desatimbukar.id",
      },
    ],
    // Unoptimized untuk development, bisa di-optimize di production
    unoptimized: process.env.NODE_ENV === "development",
  },
};

module.exports = nextConfig;
