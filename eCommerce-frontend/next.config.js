/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    }
    config.module = {
      ...config.module,
      exprContextCritical: false
    };
    return config;
  }
}

module.exports = nextConfig
