import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  images: {
    // Never proxy through /_next/image (Vercel optimizer quota returns 402).
    unoptimized: true,
    loader: "custom",
    loaderFile: "./lib/directImageLoader.ts",
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
