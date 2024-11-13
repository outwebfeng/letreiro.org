import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'letreiro.org'],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ua-parser-js');
    }
    return config;
  }
};

export default withNextIntl(nextConfig);
