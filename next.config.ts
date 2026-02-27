import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "reuters.com" },
      { protocol: "https", hostname: "*.reuters.com" },
      { protocol: "https", hostname: "cnbc.com" },
      { protocol: "https", hostname: "*.cnbc.com" },
      { protocol: "https", hostname: "insurancejournal.com" },
      { protocol: "https", hostname: "*.insurancejournal.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
