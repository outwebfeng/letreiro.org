import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_BASE_API: process.env.NEXT_BASE_API,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'letreiro.org'],
    },
  },
  experimental: {
    runtime: 'nodejs',
    serverComponents: true,
  }
};

export default withNextIntl(nextConfig);
