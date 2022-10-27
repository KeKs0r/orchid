//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');

const { withNx } = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,

  typescript: {
    tsconfigPath: join(__dirname, 'tsconfig.json'),
  },
  experimental: {
    appDir: true,
    // serverComponentsExternalPackages: [
    //   '@orchid/inspector-ui',
    //   '@orchid/inspector',
    // ],
    forceSwcTransforms: true,

    transpilePackages: ['@orchid/inspector-ui'],
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withNx(nextConfig);
