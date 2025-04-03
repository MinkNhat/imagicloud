import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: ''
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Đừng quên dấu phẩy sau mỗi thuộc tính!
};

export default nextConfig;