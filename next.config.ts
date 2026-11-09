import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  images: {
    // Vercel image optimization returns 402 once the quota is exceeded,
    // which leaves product cards as black squares. Serve originals instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kakrbeoishamowjwrpnq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
