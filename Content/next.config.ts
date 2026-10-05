import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Block MIME-sniffing attacks.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // This site is never embedded in an iframe — deny it (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // No camera/mic/location features are used anywhere.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
