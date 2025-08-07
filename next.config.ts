import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "via.placeholder.com",
      "placehold.co",
      "bucket-trex-images.s3.us-east-1.amazonaws.com"
    ],
  },
};

export default nextConfig;
