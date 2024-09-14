  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Exclude server-side only modules from the client-side bundle
        config.resolve.alias = {
          ...config.resolve.alias,
          'bufferutil': false,
          'utf-8-validate': false,
          'ws': false,
          'fs': false,
          'net': false,
          'tls': false,
          'zlib': false,
          'child_process': false,
          'dns': false,
          'dgram': false,
        };
      }
      // Fixes npm packages that depend on 'fs' module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      // Exclude 'bufferutil' and 'utf-8-validate'
      config.externals.push('bufferutil', 'utf-8-validate');
      return config;
    },
  };

  module.exports = nextConfig;