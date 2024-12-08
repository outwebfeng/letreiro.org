import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'letreiro.org'],
    },
  },
  eslint: {
    ignoreDuringBuilds: ['app/sw.js'],
  }
};

export default withNextIntl(nextConfig);
