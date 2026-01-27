/** @type {import('next').NextConfig} */
const nextConfig = {
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
