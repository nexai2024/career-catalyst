/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'images.pexels.com'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;