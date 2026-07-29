/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",        // Allows all external images (good for property images)
      },
    ],
  },

  // Important for Render deployment
  output: "standalone",

  // Optional but recommended
  experimental: {
    // You can add this if you face any issues
  },
};

export default nextConfig;