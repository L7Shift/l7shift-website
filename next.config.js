/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed up build trace collection
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/sharp',
      ],
    },
  },
  async rewrites() {
    return [
      // Portal subdomain: /prettypaidcloset -> /client/prettypaidcloset
      {
        source: '/:slug',
        has: [
          {
            type: 'host',
            value: 'portal.l7shift.com',
          },
        ],
        destination: '/client/:slug',
      },
      // Portal subdomain: /prettypaidcloset/dashboard -> /client/prettypaidcloset/dashboard
      {
        source: '/:slug/:path*',
        has: [
          {
            type: 'host',
            value: 'portal.l7shift.com',
          },
        ],
        destination: '/client/:slug/:path*',
      },
    ]
  },
}

module.exports = nextConfig
